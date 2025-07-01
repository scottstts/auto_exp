#!/usr/bin/env python3
"""
Script to concatenate all template documentation files into a single markdown file.
"""

import re
from pathlib import Path

def extract_template_number(folder_name):
    """Extract the template number from folder name like 'template 1', 'template 22', etc."""
    match = re.search(r'template (\d+)', folder_name)
    return int(match.group(1)) if match else 0

def main():
    # Get the script directory
    script_dir = Path(__file__).parent
    templates_dir = script_dir / "templates"
    output_file = script_dir / "Template_docs.md"
    
    if not templates_dir.exists():
        print(f"Templates directory not found: {templates_dir}")
        return
    
    # Get all template folders and sort them by template number
    template_folders = []
    for item in templates_dir.iterdir():
        if item.is_dir() and item.name.startswith("template "):
            template_folders.append(item)
    
    # Sort folders by template number
    template_folders.sort(key=lambda x: extract_template_number(x.name))
    
    print(f"Found {len(template_folders)} template folders")
    
    # Open output file for writing
    with open(output_file, 'w', encoding='utf-8') as outfile:
        
        for folder in template_folders:
            template_num = extract_template_number(folder.name)
            doc_file = folder / "documentation.md"
            
            if doc_file.exists():
                print(f"Processing Template {template_num}...")
                
                # Write template header
                outfile.write(f"# Template {template_num}\n\n")
                
                # Read and write the documentation content
                try:
                    with open(doc_file, 'r', encoding='utf-8') as infile:
                        content = infile.read().strip()
                        outfile.write(content)
                        outfile.write("\n\n")
                except Exception as e:
                    print(f"Error reading {doc_file}: {e}")
                    outfile.write(f"Error reading documentation for Template {template_num}\n\n")
            else:
                print(f"Warning: documentation.md not found in {folder.name}")
                outfile.write(f"Documentation not found for Template {template_num}\n\n")
    
    print(f"Concatenation complete! Output saved to: {output_file}")
    print(f"Total templates processed: {len(template_folders)}")

if __name__ == "__main__":
    main()
