from google import genai
from google.genai import types
import wave
import os
from dotenv import load_dotenv
import re
from pathlib import Path

# Set up the wave file to save the output:
def wave_file(filename, pcm, channels=1, rate=24000, sample_width=2):
    with wave.open(str(filename), "wb") as wf:
        wf.setnchannels(channels)
        wf.setsampwidth(sample_width)
        wf.setframerate(rate)
        wf.writeframes(pcm)

def clean_prompt(text: str) -> str:
    """
    Clean up a multiline string for `gemini-2.5-flash-preview-tts`.

    Preserves human paragraph breaks without triggering the
    bug of model producing trailing silence.
    """
    # Remove leading and trailing whitespace from the entire text
    text = text.strip()
    
    # Split into lines
    lines = text.split('\n')
    
    # Clean each line: strip whitespace from both ends
    cleaned_lines = []
    for line in lines:
        cleaned_line = line.strip()
        # Only add non-empty lines
        if cleaned_line:
            cleaned_lines.append(cleaned_line)
    
    # This maintains readability while avoiding the newline issue
    cleaned_text = ' '.join(cleaned_lines)
    
    # Ensure no multiple consecutive spaces
    cleaned_text = re.sub(r'\s+', ' ', cleaned_text)
    
    # Optional: Add a period at the end if missing (helps with proper ending)
    if cleaned_text and cleaned_text[-1] not in '.!?':
        cleaned_text += '.'
    
    return cleaned_text

def debug_text_issues(text: str):
    """Debug function to visualize potential issues in the text"""
    print("=== TEXT DEBUG INFO ===")
    print(f"Total length: {len(text)}")
    print(f"Starts with whitespace: {text[0].isspace() if text else 'N/A'}")
    print(f"Ends with whitespace: {text[-1].isspace() if text else 'N/A'}")
    
    # Check for multiple consecutive newlines
    newline_pattern = re.findall(r'\n+', text)
    if newline_pattern:
        print(f"Newline patterns found: {[len(p) for p in newline_pattern]}")
    
    # Show representation with visible whitespace
    visible_text = text.replace('\n', '\\n').replace('\r', '\\r').replace(' ', '·')
    print(f"\nVisible whitespace (first 200 chars):\n{visible_text[:200]}")
    print("======================\n")

def generate(text, voice):
    load_dotenv()

    client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

    response = client.models.generate_content(
        model="gemini-2.5-flash-preview-tts",
        contents=text,
        config=types.GenerateContentConfig(
            temperature=0.2,
            response_modalities=["AUDIO"],
            speech_config=types.SpeechConfig(
                voice_config=types.VoiceConfig(
                    prebuilt_voice_config=types.PrebuiltVoiceConfig(
                        voice_name=voice,
                    )
                )
            ),
        )
    )

    data = response.candidates[0].content.parts[0].inline_data.data

    file_name=f'{voice}.wav'
    folder = Path("./VO_exp")
    wave_file(folder / file_name, data)
    print(f"Audio saved to {folder / file_name}")

if __name__ == "__main__":

    text = """
Resuming from the last lesson, we composed the prompt for generating a PRD, and let’s click send.

We can see the PRD has been generated. Review the content of the generated PRD to make sure that critical information is still correct and there is no misinterpretation, especially in terms of the business logic.

Once we confirm the PRD is accurate. We can prompt the AI to build the app.

We are seeing that in the middle of Claude’s response, a Claude Artifact is triggered and opened on the right side of the app window. Immediately, we notice that code is being populated inside the artifact code window. Just wait patiently as Claude finishes the code generation.

Here we observe a bug occurring in the code Claude just generated. We can see at the bottom of the artifact panel there is a “Try Fixing with Claude” button. Let’s click this as our debugging option, and we will discuss what this button does in a later lesson.

Now that the debugging is finished, we see that the code is automatically running without us having to do anything. We can see the app interface which now exists inside the Artifact panel.

Remember to always first check whether the app’s core functionality is working as intended. If the app does not function properly, don’t waste time on polishing minor features and style designs. The objective of this Vibe Coding project is for Alex to use the app as a presentation tool. Therefore, it is important to make sure that the app represents the accurate business logic we determined before. Play with the sliders and observe the calculated ROI, as well as the numbers in the chart. Let’s check if the calculation is in fact correct, and that the chart is correctly charting the calculated ROI. 

After some manual checking, we find that the app does in fact correctly work as expected.

Once the core functionalities are working correctly, we can think about aesthetics. We notice that the app interface is pretty simplistic. So here we can try to further prompt Claude to make the app look better. Simply make requests like “Can you systemically improve the styles of the app, use sophisticated tailwind styles and make the app look modern and professional?”

After clicking send, Claude would respond, and we can see there are lines of code being modified top to bottom. Again wait patiently until Claude finishes modifying the code.

Wait until the code modification is complete, and we can take a look at the modified app interface. Claude is extremely good at web UI styles design, so typically, if we’d ask for a style improvement without specifying any details, it would do a great job improving the UI aesthetics.

So far, we have used Claude to generate a functional app based on the requirements specified in a PRD, we have tested the app, and requested the app’s aesthetics improvement. This concludes our first hands-on case study. 

During the follow-along, it is possible to encounter slight differences in the app than what we demonstrate here. This is a fundamental nature of working with AI, in that AI models are inherently non-deterministic.

Don’t be intimidated by errors or unpredictabilities. Try to recall the mental framework we introduced in Lesson 3. Think less like a developer and more like a product manager. Try to employ fundamental problem solving skills, investigate the problem at a higher level, and communicate with AI as one would with a human developer. With more practice, this process will become more smooth.

"""
    voice_name = 'Puck'
    
    # Debug the original text
    print("ORIGINAL TEXT:")
    debug_text_issues(text)
    
    # Clean the text before sending to TTS
    cleaned_text = clean_prompt(text)
    
    print("\nCLEANED TEXT:")
    debug_text_issues(cleaned_text)
    
    print(f"Original text length: {len(text)}")
    print(f"Cleaned text length: {len(cleaned_text)}")
    print(f"\nCleaned text preview:\n{cleaned_text[:200]}...\n")
    
    generate(cleaned_text, voice_name)