from flask import jsonify
import os
import base64
from dotenv import load_dotenv

from google.cloud import speech
from google.cloud import texttospeech
import vertexai
from vertexai.generative_models import GenerativeModel
from services.stt import transcribe_audio
from services.prompt_builder import build_coach_prompt

load_dotenv()

speech_client = None
tts_client = None
gemini_model = None

def init_clients():
    """Initializes Google Cloud clients if they are not already set."""
    global speech_client, tts_client, gemini_model

    if speech_client and tts_client and gemini_model:
        return 

    load_dotenv()
    project_id = os.getenv("GOOGLE_CLOUD_PROJECT_ID")

    if not project_id:
        raise EnvironmentError("GOOGLE_CLOUD_PROJECT_ID is not set in .env or environment")

    vertexai.init(project=project_id, location="us-central1")
    speech_client = speech.SpeechClient()
    tts_client = texttospeech.TextToSpeechClient()
    gemini_model = GenerativeModel("gemini-2.0-flash-lite")


def chat_to_coach(audio_file_storage, strava_activities):
    """
    Processes user audio using Google Cloud STT, sends the text and Strava data
    to Gemini, gets text response, synthesizes it using Google Cloud TTS,
    and returns the audio response as Base64 JSON.
    """
    try:
        init_clients()

        if not speech_client or not tts_client or not gemini_model:
            return jsonify({"error": "AI services are not initialized. Check server logs."}), 500

        transcript = transcribe_audio(audio_file_storage)
        if not transcript:
            return jsonify({"error": "Could not understand audio."}), 400

        full_prompt = build_coach_prompt(transcript, strava_activities)

        gemini_response = gemini_model.generate_content(full_prompt)

        if not gemini_response.candidates or not gemini_response.candidates[0].content.parts:
            print("Gemini returned no content.")
            return jsonify({"error": "AI coach failed to generate a response."}), 500

        coach_text_response = gemini_response.text

        synthesis_input = texttospeech.SynthesisInput(text=coach_text_response)

        voice = texttospeech.VoiceSelectionParams(
            language_code="en-GB",
            name="en-GB-Chirp3-HD-Fenrir",
        )
        audio_config = texttospeech.AudioConfig(
            audio_encoding=texttospeech.AudioEncoding.MP3
        )

        tts_response = tts_client.synthesize_speech(
            input=synthesis_input, voice=voice, audio_config=audio_config
        )

        audio_response_base64 = base64.b64encode(tts_response.audio_content).decode("utf-8")
        return jsonify({"audio_response": audio_response_base64})

    except Exception as e:
        print(f"Error during AI processing: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": "Failed to process request by AI coach"}), 500