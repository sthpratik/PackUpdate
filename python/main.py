#!/usr/bin/env python3
"""
PackUpdate - Python Package Updater
Entry point script
"""
import sys
import os

# Add the packUpdate directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'packUpdate'))

from packUpdate.updatePackages import main

if __name__ == "__main__":
    main()
