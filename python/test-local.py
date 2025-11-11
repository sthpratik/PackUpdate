#!/usr/bin/env python3

import os
import json
import subprocess
import shutil
import sys

def create_test_project():
    """Create a test Node.js project with outdated packages."""
    test_dir = "test-project"
    
    # Clean up if exists
    if os.path.exists(test_dir):
        shutil.rmtree(test_dir)
    
    os.makedirs(test_dir)
    
    # Create package.json with actually outdated packages
    package_json = {
        "name": "test-project",
        "version": "1.0.0",
        "scripts": {
            "test": "echo 'Tests passed'",
            "build": "echo 'Build completed'"
        },
        "dependencies": {
            "lodash": "4.17.20",
            "axios": "0.21.0"
        }
    }
    
    with open(os.path.join(test_dir, "package.json"), "w") as f:
        json.dump(package_json, f, indent=2)
    
    # Install packages
    subprocess.run(["npm", "install"], cwd=test_dir, check=True)
    
    return test_dir

def test_packupdate():
    """Test the PackUpdate functionality."""
    print("Creating test project...")
    test_dir = create_test_project()
    
    try:
        print("Testing PackUpdate...")
        subprocess.run([
            sys.executable, 
            "main.py", 
            test_dir
        ], check=True)
        
        print("Test completed successfully! Check logs folder for output.")
        
    finally:
        # Clean up
        if os.path.exists(test_dir):
            shutil.rmtree(test_dir)

if __name__ == "__main__":
    test_packupdate()
