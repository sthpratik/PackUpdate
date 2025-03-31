from setuptools import setup, find_packages

setup(
    name="packUpdate",
    version="1.0.1",
    description="A Python utility to update Node.js project dependencies safely.",
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
