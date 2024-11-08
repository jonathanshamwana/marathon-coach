from flask import Blueprint, jsonify, request
from openai import OpenAI
import os
from dotenv import load_dotenv
import base64

load_dotenv()

openai_bp = Blueprint('openai', __name__)
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def chat_to_coach(audio_data, strava_activities):
    """
    Handles user audio and Strava activity data, sends it to OpenAI, and returns the audio response.
    """
    try:
        # Encode the audio file in base64 format
        audio_base64 = base64.b64encode(audio_data.read()).decode("utf-8")

        # Construct the prompt with Strava activity data
        prompt = (
            "You're a marathon coach for a busy 22-year-old university student. "
            "Provide training, recovery, gym, and nutrition advice. "
            f"Here are their recent activities: {strava_activities}. "
            "Respond based on the user’s audio input."
            "The user's favorite rapper is Jay-Z and he often listens to JayZ during tough workouts. Make of that what you will."
            "Speak casually, occasionally throwing in some GenZ slang."
        )

        # Call OpenAI’s API for processing
        response = client.chat.completions.create(
            model="gpt-4-turbo",
            messages=[{"role": "user", "content": prompt}],
            response_format="audio",
            voice_input={"data": audio_base64, "content_type": "audio/wav"},
            voice_output=True
        )

        # Return the audio response
        audio_response = base64.b64decode(response.choices[0].message.content)
        return jsonify({"audio_response": base64.b64encode(audio_response).decode("utf-8")})

    except Exception as e:
        print("An error occurred:", e)
        return jsonify({"error": "Failed to get coach response"}), 500

