from flask import Blueprint, request, jsonify
from .strava_api import fetch_recent_strava_activities
from .openai_api import chat_to_coach

coach_bp = Blueprint('coach', __name__)

@coach_bp.route('/chat-to-coach', methods=['POST'])
def chat_with_coach():
    """
    Combines audio and Strava data and sends it to OpenAI.
    """
    try:
         # Get audio file from request
        audio_data = request.files['audio']

        # Fetch recent Strava activities
        activities = fetch_recent_strava_activities()

        # Call chat_to_coach with parameters
        response = chat_to_coach(audio_data, activities)

        return response
    except Exception as e:
        print(f"Error in endpoint: {e}")
        return jsonify({"error": "Failed to process combined request"}), 500
