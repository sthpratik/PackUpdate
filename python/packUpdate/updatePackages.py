import subprocess
import os
import sys
import json
from datetime import datetime

LOG_DIR = "logs"
LOG_FILE = os.path.join(LOG_DIR, f"packupdate-{datetime.now().isoformat().replace(':', '-').replace('.', '-')}.log")
QUIET_MODE = False

def write_log(message):
    """Write a message to the log file with timestamp."""
    if not os.path.exists(LOG_DIR):
        os.makedirs(LOG_DIR, exist_ok=True)
    timestamp = datetime.now().isoformat()
    with open(LOG_FILE, 'a') as f:
        f.write(f"[{timestamp}] {message}\n")

def log(message):
    """Print message only if not in quiet mode."""
    if not QUIET_MODE:
        print(message)

def print_outdated_packages(outdated_packages):
    """Print the outdated packages in a formatted table."""
    log("\nOutdated Packages:")
    log("{:<40} {:<10} {:<10} {:<10}".format("Package", "Current", "Wanted", "Latest"))
    log("-" * 70)
    for package, details in outdated_packages.items():
        current_version = details.get("current", "N/A")
        wanted_version = details.get("wanted", "N/A")
        latest_version = details.get("latest", "N/A")
        log("{:<40} {:<10} {:<10} {:<10}".format(package, current_version, wanted_version, latest_version))
    log("-" * 70)

def get_outdated_packages(project_path):
    result = subprocess.run(['npm', 'outdated', '--json'], cwd=project_path, capture_output=True, text=True)
    if result.returncode != 0 and result.stderr:
        error_msg = f"Error running npm outdated: {result.stderr}"
        print(error_msg)
        write_log(f"ERROR: {error_msg}")
        return {}
    
    try:
        outdated_packages = json.loads(result.stdout) if result.stdout.strip() else {}
        write_log(f"Found {len(outdated_packages)} outdated packages: {list(outdated_packages.keys())}")
        print_outdated_packages(outdated_packages)
    except Exception as e:
        error_msg = f"Error parsing npm outdated output: {e}"
        print(error_msg)
        write_log(f"ERROR: {error_msg}")
        return {}
    
    return outdated_packages

def sanitize_json_output(output):
    """Sanitize JSON output to replace JavaScript-style values with Python-compatible values."""
    sanitized_output = output.replace("false", "false").replace("true", "true").replace("null", "null")
    return sanitized_output

def get_dependency_tree(project_path):
    """Fetch the dependency tree using npm ls."""
    try:
        result = subprocess.run(['npm', 'ls', '--json'], cwd=project_path, capture_output=True, text=True)
        sanitized_output = sanitize_json_output(result.stdout)
        dependency_tree = json.loads(sanitized_output)
    except Exception as e:
        error_msg = f"Error parsing npm ls output: {e}"
        print(error_msg)
        write_log(f"ERROR: {error_msg}")
        return {}
    
    return dependency_tree

def resolve_update_order(outdated_packages, dependency_tree):
    """Determine the order of updates based on interdependencies among outdated packages."""
    resolved_order = []
    visited = set()

    def visit(package):
        if package in visited:
            return
        visited.add(package)
        dependencies = dependency_tree.get('dependencies', {}).get(package, {}).get('requires', {})
        for dep in dependencies:
            if dep in outdated_packages:
                visit(dep)
        resolved_order.append(package)

    for package in outdated_packages:
        visit(package)
    
    return resolved_order

def execute_script_if_exist(project_path, script_name="test"):
    """Check if the project has a script in package.json."""
    package_json_path = os.path.join(project_path, "package.json")
    if not os.path.isfile(package_json_path):
        return False
        
    try:
        with open(package_json_path, "r") as f:
            package_data = json.load(f)
        script_exists = script_name in package_data.get("scripts", {})
        returnCode = 0;
        if  script_exists:
            script_execute = subprocess.run(["npm", "run", script_name], cwd=project_path, 
                                          capture_output=QUIET_MODE, text=True)
            returnCode = script_execute.returncode
        else :
            returnCode = 0
            log(f"No test script found in package.json. Skipping tests.returnCode: {returnCode}")
        return returnCode == 0
    except Exception as e:
        error_msg = f"Error reading package.json: {e}"
        print(error_msg)
        write_log(f"ERROR: {error_msg}")
        return False

def run_tests(project_path):
    log("\nRunning build...")
    resultBuild = execute_script_if_exist(project_path, "build")
    log("\nRunning tests...")
    resultTest = execute_script_if_exist(project_path, "test")
    if resultBuild == False or resultTest == False:
        error_msg = "Tests failed."
        write_log(f"ERROR: {error_msg}")
        raise Exception(error_msg)

def install_package(package, version, project_path):
    """Install a specific package version."""
    try:
        log(f"\nUpdating {package} to {version}...")
        subprocess.run(["npm", "install", f"{package}@{version}"], cwd=project_path, check=True,
                      capture_output=QUIET_MODE, text=True)
    except subprocess.CalledProcessError as e:
        error_msg = f"Error installing {package}@{version}: {e}"
        write_log(f"ERROR: {error_msg}")
        raise Exception(error_msg)
    return True

def install_package_and_run_tests(package, version, project_path):
    """Install a specific package version and run tests.""" 
    install_package(package, version, project_path)
    run_tests(project_path)
    log(f"{package} updated to version {version} successfully.")

def update_packages_in_order(outdated_packages, dependency_tree, project_path, safe_mode):   
    """Update packages in the resolved order."""
    update_order = resolve_update_order(outdated_packages, dependency_tree)
    log("\nUpdate Order: " + ", ".join(update_order))
    
    failed_updates = []
    updated_packages = []

    for package in update_order:
        details = outdated_packages[package]
        current_version = details.get("current")
        wanted_version = details.get("wanted")
        latest_version = details.get("latest")
        final_version = current_version
        
        if safe_mode:
            log(f"\nTrying to update {package} to latest version {latest_version}...")
            try:
                install_package_and_run_tests(package, latest_version, project_path)
                final_version = latest_version
                write_log(f"SUCCESS: Updated {package} from {current_version} to {latest_version}")
            except:
                log(f"Tests failed. Reverting to wanted version {wanted_version}...")
                try:
                    install_package_and_run_tests(package, wanted_version, project_path)
                    final_version = wanted_version
                    write_log(f"SUCCESS: Updated {package} from {current_version} to {wanted_version}")
                except:
                    log(f"Tests failed again. Reverting to current version {current_version}...")
                    final_version = current_version
                    install_package_and_run_tests(package, current_version, project_path)
                    failed_updates.append(package)
                    write_log(f"FAILED: {package} update failed")
        else:
            if current_version and latest_version and current_version != latest_version:
                try:
                    install_package_and_run_tests(package, latest_version, project_path)
                    final_version = latest_version
                    write_log(f"SUCCESS: Updated {package} from {current_version} to {latest_version}")
                except Exception as e:
                    error_msg = f"Failed to update {package}: {e}"
                    write_log(f"ERROR: {error_msg}")
                    failed_updates.append(package)
                    write_log(f"FAILED: {package} update failed")
            else:
                log(f"Skipping {package}, already at latest version or missing version info.")
        
        updated_packages.append((package, current_version, final_version))
    return updated_packages, failed_updates

def print_final_summary(all_updated_packages, all_failed_updates):
    """Print the final summary of updated packages."""
    log("\nFinal Update Summary:")
    log("{:<40} {:<10} {:<10}".format("Package", "Old Version", "New Version"))
    log("-" * 60)
    for pass_num, updated_packages in all_updated_packages:
        log(f"\n=== Pass {pass_num} ===")
        for package, old_version, new_version in updated_packages:
            log("{:<40} {:<10} {:<10}".format(package, old_version, new_version))
    log("-" * 60)

    if all_failed_updates:
        log("\nPackages that failed to update:")
        for package in set(all_failed_updates):
            log(f"- {package}")

def run_update_process(project_path, safe_mode, passes):
    all_updated_packages = []
    all_failed_updates = []
    
    for i in range(passes):
        log(f"\n=== Pass {i + 1} ===")
        outdated_packages = get_outdated_packages(project_path)
        if not outdated_packages:
            log("No more outdated packages found.")
            break
        
        dependency_tree = get_dependency_tree(project_path)
        updated_packages, failed_updates = update_packages_in_order(outdated_packages, dependency_tree, project_path, safe_mode)
        all_updated_packages.append((i + 1, updated_packages))
        all_failed_updates.extend(failed_updates)
    

    log("\nRunning final npm audit and build...")
    subprocess.run(["npm", "audit", "fix"], cwd=project_path, capture_output=QUIET_MODE, text=True)
    execute_script_if_exist(project_path, "build")
    print_final_summary(all_updated_packages, all_failed_updates)

def show_help():
    """Display help message with all available parameters."""
    print("""
PackUpdate - Python Package Updater

Usage: updatenpmpackages [project_path] [options]

Arguments:
  project_path              Path to the Node.js project (default: current directory)

Options:
  --safe                   Enable safe mode (test updates before applying)
  --quiet                  Enable quiet mode (minimal console output)
  --pass=<number>          Number of update passes (default: 1)
  --version                Show package version
  --type                   Show package type (python)
  --help                   Show this help message

Examples:
  updatenpmpackages                           # Update current directory
  updatenpmpackages /path/to/project         # Update specific project
  updatenpmpackages --safe --quiet           # Safe and quiet mode
  updatenpmpackages --pass=3                 # Multiple passes
  updatenpmpackages --version                # Show version
""")

def main():
    global QUIET_MODE
    
    # Filter out flags to get the project path
    args = sys.argv[1:]
    flags = [arg for arg in args if arg.startswith('--')]
    non_flags = [arg for arg in args if not arg.startswith('--')]
    
    project_path = non_flags[0] if non_flags else os.getcwd()
    safe_mode = "--safe" in flags
    QUIET_MODE = "--quiet" in flags
    show_version = "--version" in flags
    show_type = "--type" in flags
    show_help_flag = "--help" in flags
    pass_arg = next((arg for arg in flags if arg.startswith("--pass=")), None)
    passes = int(pass_arg.split("=")[1]) if pass_arg else 1
    
    # Handle help flag
    if show_help_flag:
        show_help()
        return
    
    # Handle version flag
    if show_version:
        import pkg_resources
        try:
            version = pkg_resources.get_distribution("packupdate").version
            print(version)
        except:
            print("Unknown")
        return
    
    # Handle type flag
    if show_type:
        print("python")
        return
    
    write_log(f"PackUpdate started - Project: {project_path}, Safe Mode: {safe_mode}, Passes: {passes}, Quiet: {QUIET_MODE}")
    
    if not os.path.isdir(project_path):
        error_msg = f"Error: {project_path} is not a valid directory."
        print(error_msg)
        write_log(f"ERROR: {error_msg}")
        sys.exit(1)
    
    run_update_process(project_path, safe_mode, passes)
    write_log(f"PackUpdate completed - Log file: {LOG_FILE}")
    print(f"Log file created: {LOG_FILE}")

if __name__ == "__main__":
    main()