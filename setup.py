from setuptools import setup, find_packages

# read the contents of your README file
from pathlib import Path
this_directory = Path(__file__).parent
long_description = (this_directory / "README.md").read_text()

setup(
    name="packupdate",
    version="1.0.2",
    description="A Python utility to update Node.js project dependencies safely.",
    long_description=long_description,
    long_description_content_type='text/markdown',
    author="Manish Shrestha",
    author_email="sth.pratik@gmail.com",
    url="https://github.com/sthpratik/PackUpdate",
    packages=find_packages(),  # Automatically finds the 'packUpdate' package
    install_requires=[],
    entry_points={
        "console_scripts": [
            "updatePackages=packUpdate.updatePackages:main",  # Update the entry point
        ],
    },
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires=">=3.8",
)
