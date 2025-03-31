import subprocess
import os
import sys

def get_outdated_packages(project_path):
    result = subprocess.run(['npm', 'outdated', '--json'], cwd=project_path, capture_output=True, text=True)
    if result.returncode != 0 and result.stderr:
        print("Error running npm outdated:", result.stderr)
        return {}
    
    try:
        outdated_packages = eval(result.stdout)  # Convert JSON output to dict
    except Exception as e:
        print("Error parsing npm outdated output:", e)
        return {}
    
    return outdated_packages

def run_tests(project_path):
    print("\nRunning tests...")
    result = subprocess.run(["npm", "run", "test"], cwd=project_path)
    return result.returncode == 0

def update_packages(packages, project_path, safe_mode=False):
    failed_updates = []
    updated_packages = []
    
    print("\nOutdated Packages:")
    print("{:<40} {:<10} {:<10} {:<10}".format("Package", "Current", "Wanted", "Latest"))
    print("-" * 70)
    for package, details in packages.items():
        current_version = details.get("current", "N/A")
        wanted_version = details.get("wanted", "N/A")
        latest_version = details.get("latest", "N/A")
        print("{:<40} {:<10} {:<10} {:<10}".format(package, current_version, wanted_version, latest_version))
    
    for package, details in packages.items():
        current_version = details.get("current")
        wanted_version = details.get("wanted")
        latest_version = details.get("latest")
        final_version = current_version
        
        if safe_mode:
            print(f"\nTrying to update {package} to latest version {latest_version}...")
            try:
                subprocess.run(["npm", "install", f"{package}@{latest_version}"], cwd=project_path)
                if run_tests(project_path):
                    final_version = latest_version
                    print(f"{package} updated to latest version successfully.")
                else:
                    raise Exception("Tests failed for latest version.")
            except:
                print(f"Tests failed. Reverting to wanted version {wanted_version}...")
                try:
                    subprocess.run(["npm", "install", f"{package}@{wanted_version}"], cwd=project_path)
                    if run_tests(project_path):
                        final_version = wanted_version
                        print(f"{package} updated to wanted version successfully.")
                    else:
                        raise Exception("Tests failed for wanted version.")
                except:
                    print(f"Tests failed again. Reverting to current version {current_version}...")
                    subprocess.run(["npm", "install", f"{package}@{current_version}"], cwd=project_path)
                    failed_updates.append(package)
        else:
            if current_version and wanted_version and current_version != wanted_version:
                print(f"\nUpdating {package} from {current_version} to {wanted_version}...")
                try:
                    subprocess.run(["npm", "install", f"{package}@{wanted_version}"], cwd=project_path, check=True)
                    final_version = wanted_version
                except Exception as e:
                    print(f"Error updating {package}@{wanted_version}: {e}")
                    failed_updates.append(package)
            else:
                print(f"Skipping {package}, already at wanted version or missing version info.")
        
        updated_packages.append((package, current_version, final_version))
    
    return updated_packages, failed_updates

def run_update_process(project_path, safe_mode, passes):
    all_updated_packages = []
    all_failed_updates = []
    
    for i in range(passes):
        print(f"\n=== Pass {i + 1} ===")
        outdated_packages = get_outdated_packages(project_path)
        if not outdated_packages:
            print("No more outdated packages found.")
            break
        
        updated_packages, failed_updates = update_packages(outdated_packages, project_path, safe_mode)
        all_updated_packages.append((i + 1, updated_packages))
        all_failed_updates.extend(failed_updates)
    
    print("\nFinal Update Summary:")
    for pass_num, updates in all_updated_packages:
        print(f"\nPass {pass_num}:")
        print("{:<40} {:<10} {:<10}".format("Package", "Old Version", "New Version"))
        print("-" * 60)
        for package, old_version, new_version in updates:
            print("{:<40} {:<10} {:<10}".format(package, old_version, new_version))
    
    if all_failed_updates:
        print("\nPackages that failed to update:")
        for package in set(all_failed_updates):
            print(f"- {package}")
    
    print("\nRunning final npm audit and build...")
    subprocess.run(["npm", "audit", "fix"], cwd=project_path)
    subprocess.run(["npm", "run", "build"], cwd=project_path)

def main():
    if len(sys.argv) < 2:
        print("Usage: updatePackages <project_path> [--safe] [--pass=N]")
        sys.exit(1)
    
    project_path = sys.argv[1]
    safe_mode = "--safe" in sys.argv
    pass_arg = next((arg for arg in sys.argv if arg.startswith("--pass=")), None)
    passes = int(pass_arg.split("=")[1]) if pass_arg else 1
    
    if not os.path.isdir(project_path):
        print(f"Error: {project_path} is not a valid directory.")
        sys.exit(1)
    
    run_update_process(project_path, safe_mode, passes)

if __name__ == "__main__":
    main()