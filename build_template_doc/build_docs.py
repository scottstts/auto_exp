import asyncio
import os
from pathlib import Path
import google.generativeai as genai
from dotenv import load_dotenv

# --- Configuration ---
# Load environment variables from .env file
load_dotenv()

# IMPORTANT: Set your Gemini API key in a .env file or as an environment variable
# e.g., GEMINI_API_KEY=your_api_key_here
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise ValueError("GEMINI_API_KEY not found. Please set it in your .env file or environment.")

# --- User-defined start and end range ---
# Specify the range of templates to process
START_TEMPLATE = 1
END_TEMPLATE = 22
# -----------------------------------------

# Configure the Gemini client
genai.configure(api_key=API_KEY)

# Define paths
ROOT_DIR = Path(__file__).parent.parent
TEMPLATE_DIR = ROOT_DIR / "build_template_doc" / "templates"
SYSTEM_PROMPT_FILE = ROOT_DIR / "build_template_doc" / "build_doc_system_prompt.md"

# --- Main Functions ---

async def process_template(template_number: int, system_prompt: str):
    """
    Processes a single template folder: uploads files, makes an API call to Gemini,
    and writes the response to a markdown file.
    """
    print(f"Starting processing for template {template_number}...")
    
    current_template_dir = TEMPLATE_DIR / f"template {template_number}"
    image_path = current_template_dir / f"template {template_number}.png"
    video_path = current_template_dir / f"template {template_number}.mp4"
    output_path = current_template_dir / "documentation.md"

    if not image_path.exists() or not video_path.exists():
        print(f"Skipping template {template_number}: media files not found.")
        return

    try:
        # Prepare the model and content for the API call
        model = genai.GenerativeModel(
            'gemini-2.5-pro',
            system_instruction=system_prompt
        )
        
        image_part = {"mime_type": "image/png", "data": image_path.read_bytes()}
        video_part = {"mime_type": "video/mp4", "data": video_path.read_bytes()}

        # Make the API call
        response = await model.generate_content_async(
            [image_part, video_part], # Pass only media as content
            request_options={'timeout': 600} # Extend timeout for large files
        )

        # Write the response to the output file
        with open(output_path, "w") as f:
            f.write(response.text)
            
        print(f"✅ Successfully generated documentation for template {template_number}")

    except Exception as e:
        print(f"❌ Failed to process template {template_number}. Error: {e}")


async def main():
    """
    Main function to orchestrate the concurrent processing of templates.
    """
    print("--- Starting Template Documentation Generation ---")
    
    # 1. Read the system prompt
    try:
        with open(SYSTEM_PROMPT_FILE, "r") as f:
            system_prompt = f.read()
    except FileNotFoundError:
        print(f"Error: System prompt file not found at {SYSTEM_PROMPT_FILE}")
        return

    # 2. Create concurrent tasks for each template
    tasks = [
        process_template(i, system_prompt)
        for i in range(START_TEMPLATE, END_TEMPLATE + 1)
    ]
    
    # 3. Run all tasks concurrently
    await asyncio.gather(*tasks)
    
    print("--- All templates processed. ---")


if __name__ == "__main__":
    # To run this script, you need to install the required libraries:
    # pip install google-generativeai Pillow python-dotenv
    #
    # You also need to have a .env file in the root directory of this project
    # with your Gemini API Key:
    # GEMINI_API_KEY="YOUR_API_KEY"
    
    asyncio.run(main())
