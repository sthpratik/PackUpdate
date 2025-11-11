"""
CLI argument parsing and help display
"""
import sys
import os

def parse_cli_args():
    """Parse command line arguments"""
    args = sys.argv[1:]
    flags = [arg for arg in args if arg.startswith('--')]
    non_flags = [arg for arg in args if not arg.startswith('--')]
    
    pass_arg = next((arg for arg in flags if arg.startswith("--pass=")), None)
    
    return {
        'project_path': non_flags[0] if non_flags else os.getcwd(),
        'safe_mode': "--safe" in flags,
        'minor_only': "--minor-only" in flags,
        'generate_report': "--generate-report" in flags,
        'remove_unused': "--remove-unused" in flags,
        'dedupe_packages': "--dedupe-packages" in flags,
        'quiet_mode': "--quiet" in flags,
        'passes': int(pass_arg.split("=")[1]) if pass_arg else 1
    }

def handle_special_flags():
    """Check for special flags that don't require main execution"""
    args = sys.argv[1:]
    flags = [arg for arg in args if arg.startswith('--')]
    
    if "--help" in flags:
        show_help()
        return True
    
    if "--version" in flags:
        show_version()
        return True
    
    if "--type" in flags:
        print("python")
        return True
    
    return False

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
  --minor-only             Update only minor versions (1.2.x → 1.3.x, skip major updates)
  --generate-report        Generate comprehensive security & dependency report (no updates)
  --remove-unused          Clean up unused dependencies
  --dedupe-packages        Remove duplicate dependencies
  --pass=<number>          Number of update passes (default: 1)
  --version                Show package version
  --type                   Show package type (python)
  --help                   Show this help message

Examples:
  updatenpmpackages                           # Update current directory
  updatenpmpackages /path/to/project         # Update specific project
  updatenpmpackages --safe --quiet           # Safe and quiet mode
  updatenpmpackages --minor-only             # Only minor version updates
  updatenpmpackages --generate-report        # Generate security & dependency report
  updatenpmpackages --remove-unused          # Remove unused dependencies
  updatenpmpackages --dedupe-packages        # Remove duplicate dependencies
  updatenpmpackages --pass=3                 # Multiple passes
  updatenpmpackages --version                # Show version
""")

def show_version():
    """Show package version"""
    import pkg_resources
    try:
        version = pkg_resources.get_distribution("packupdate").version
        print(version)
    except:
        print("Unknown")
