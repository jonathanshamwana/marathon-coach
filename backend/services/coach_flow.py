import os
from flask import Blueprint, request, jsonify, current_app
from flask_limiter.util import get_remote_address
from werkzeug.utils import secure_filename
from .strava import fetch_recent_strava_activities
from .gemini import chat_to_coach

coach_bp = Blueprint('coach', __name__)

def allowed_file(filename):
    """Check if the file extension is allowed"""
    if '.' not in filename:
        return False
    ext = filename.rsplit('.', 1)[1].lower()
    return ext in current_app.config.get('ALLOWED_AUDIO_EXTENSIONS', {'wav', 'mp3', 'webm', 'ogg', 'm4a'})

def validate_audio_file(file):
    """Validate the uploaded audio file"""
    if not file:
        return False, "No file provided"
    
    if file.filename == '':
        return False, "No file selected"
    
    if not allowed_file(file.filename):
        return False, f"File type not allowed. Allowed types: {', '.join(current_app.config.get('ALLOWED_AUDIO_EXTENSIONS', {}))}"
    
    # Check file size (16MB limit)
    file.seek(0, 2)  # Seek to end
    file_size = file.tell()
    file.seek(0)  # Reset to beginning
    
    max_size = current_app.config.get('MAX_CONTENT_LENGTH', 16 * 1024 * 1024)
    if file_size > max_size:
        return False, f"File too large. Maximum size: {max_size // (1024 * 1024)}MB"
    
    return True, "File is valid"

@coach_bp.route('/chat-to-coach', methods=['POST'])
def chat_with_coach():
    """
    Receives audio, fetches Strava data, calls the AI coach logic,
    and returns the audio response.
    """
    try:
        # Get audio file from request using the key 'audio'
        if 'audio' not in request.files:
            return jsonify({"error": "No audio file part in the request"}), 400
        
        audio_file = request.files['audio']
        
        # Validate the uploaded file
        is_valid, error_message = validate_audio_file(audio_file)
        if not is_valid:
            return jsonify({"error": error_message}), 400

        # Fetch recent Strava activities (ensure this function handles errors)
        try:
            activities = fetch_recent_strava_activities()
            print(f"Fetched {len(activities) if activities else 0} Strava activities.")
        except Exception as strava_err:
            print(f"Error fetching Strava data: {strava_err}")
            activities = None  # Proceed without activities

        # Call the core AI processing function
        ai_response = chat_to_coach(audio_file, activities)

        # ai_response should already be a Flask Response object (from jsonify)
        return ai_response 
    
    except Exception as e:
        print(f"Error in /chat-to-coach endpoint: {e}")
        # Log the full traceback for debugging
        import traceback
        traceback.print_exc() 
        return jsonify({"error": "An internal server error occurred"}), 500