import os
import re
import fitz  # PyMuPDF
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload
import io

# If modifying these scopes, delete the file token.json.
SCOPES = ['https://www.googleapis.com/auth/drive.readonly']
PDF_FILE_PATH = 'Template Library.pptx.pdf'
CLIENT_SECRET_FILE = 'client_secret.json'
TOKEN_FILE = 'token.json'
OUTPUT_DIR = 'templates'

def get_gdrive_service():
    """Authenticates with Google Drive API and returns the service object."""
    creds = None
    if os.path.exists(TOKEN_FILE):
        creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                CLIENT_SECRET_FILE, SCOPES)
            print("Please follow the authentication steps in your browser.")
            creds = flow.run_local_server(port=0)
        
        with open(TOKEN_FILE, 'w') as token:
            token.write(creds.to_json())
    
    return build('drive', 'v3', credentials=creds)

def download_file_from_google_drive(service, file_id, destination):
    """Downloads a file from Google Drive."""
    try:
        request = service.files().get_media(fileId=file_id)
        fh = io.BytesIO()
        downloader = MediaIoBaseDownload(fh, request)
        done = False
        print(f"Downloading file with ID: {file_id} to {destination}")
        while not done:
            status, done = downloader.next_chunk()
            if status:
                print(f"Download {int(status.progress() * 100)}%.")
        
        with open(destination, "wb") as f:
            fh.seek(0)
            f.write(fh.read())
        print(f"Successfully downloaded {destination}")
        return True
    except Exception as e:
        print(f"An error occurred while downloading file ID {file_id}: {e}")
        return False

def extract_gdrive_file_id(text):
    """Extracts Google Drive file ID from text using regex."""
    match = re.search(r'drive\.google\.com/file/d/([a-zA-Z0-9_-]+)', text)
    if match:
        return match.group(1)
    return None

def main():
    """
    Extracts templates from a PDF, downloads associated videos from Google Drive,
    and saves them in a structured directory.
    """
    if not os.path.exists(PDF_FILE_PATH):
        print(f"Error: PDF file not found at '{PDF_FILE_PATH}'")
        return
        
    if not os.path.exists(CLIENT_SECRET_FILE):
        print(f"Error: Google client secret file not found at '{CLIENT_SECRET_FILE}'")
        print("Please download it from Google Cloud Console and place it in the correct directory.")
        return

    print("Authenticating with Google Drive...")
    gdrive_service = get_gdrive_service()
    print("Authentication successful.")

    os.makedirs(OUTPUT_DIR, exist_ok=True)

    pdf_document = fitz.open(PDF_FILE_PATH)
    
    for page_num in range(1, len(pdf_document)):
        template_number = page_num
        template_name = f"template {template_number}"
        template_dir = os.path.join(OUTPUT_DIR, template_name)
        os.makedirs(template_dir, exist_ok=True)
        
        print(f"\nProcessing {template_name} from PDF page {page_num + 1}...")

        page = pdf_document.load_page(page_num)

        image_path = os.path.join(template_dir, f"{template_name}.png")
        if not os.path.exists(image_path):
            pix = page.get_pixmap(dpi=300)
            pix.save(image_path)
            print(f"Saved template image to {image_path}")
        else:
            print(f"Image already exists: {image_path}")

        text = page.get_text("text").replace("\n", "")
        file_id = extract_gdrive_file_id(text)

        if file_id:
            print(f"Found Google Drive file ID: {file_id}")
            video_path = os.path.join(template_dir, f"{template_name}.mp4")
            if not os.path.exists(video_path):
                 download_file_from_google_drive(gdrive_service, file_id, video_path)
            else:
                print(f"Video already exists: {video_path}")
        else:
            print(f"Could not find a Google Drive link on page {page_num + 1}.")

    pdf_document.close()
    print("\nExtraction process completed.")

if __name__ == '__main__':
    main()
