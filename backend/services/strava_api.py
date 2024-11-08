import os
import requests
from flask import Flask, jsonify
from dotenv import load_dotenv
from flask_cors import CORS

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

client_id = os.getenv('STRAVA_CLIENT_ID')
client_secret = os.getenv('STRAVA_CLIENT_SECRET')
refresh_token = os.getenv('STRAVA_REFRESH_TOKEN')

def refresh_strava_token():
    response = requests.post(
        url="https://www.strava.com/oauth/token",
        data={
            'client_id': client_id,
            'client_secret': client_secret,
            'grant_type': 'refresh_token',
            'refresh_token': refresh_token
        }
    )
    if response.status_code == 200:
        new_token = response.json()
        os.environ['STRAVA_ACCESS_TOKEN'] = new_token['access_token']
        os.environ['STRAVA_REFRESH_TOKEN'] = new_token['refresh_token']
        return new_token['access_token']
    else:
        print(f"Error refreshing token: {response.status_code} - {response.text}")
        return None

def get_strava_profile():
    access_token = refresh_strava_token()
    if access_token:
        response = requests.get(
            url="https://www.strava.com/api/v3/athlete",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        if response.status_code == 200:
            return jsonify(response.json()), 200
        else:
            return jsonify({'error': f"Error fetching profile: {response.status_code} - {response.text}"}), 500
    else:
        return jsonify({'error': 'Failed to refresh access token.'}), 500

def get_strava_activities():
    access_token = refresh_strava_token()
    if access_token:
        response = requests.get(
            url="https://www.strava.com/api/v3/athlete/activities",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        if response.status_code == 200:
            return jsonify(response.json()), 200
        else:
            return jsonify({'error': f"Error fetching activities: {response.status_code} - {response.text}"}), 500
    else:
        return jsonify({'error': 'Failed to refresh access token.'}), 500

def get_ytd_run_totals():
    access_token = refresh_strava_token()
    if access_token:
        url = f"https://www.strava.com/api/v3/athletes/{client_id}/stats"
        response = requests.get(
            url=url,
            headers={"Authorization": f"Bearer {access_token}"}
        )
        if response.status_code == 200:
            ytd_run_totals = response.json().get('ytd_run_totals', {})
            return jsonify(ytd_run_totals), 200
        else:
            return jsonify({'error': f"Error fetching stats: {response.status_code} - {response.text}"}), 500
    else:
        return jsonify({'error': 'Failed to refresh access token.'}), 500
    

def fetch_recent_strava_activities():
    access_token = refresh_strava_token()
    if access_token:
        response = requests.get(
            url="https://www.strava.com/api/v3/athlete/activities",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        if response.status_code == 200:
            return response.json()  # Return list of activities
        else:
            print(f"Error fetching activities: {response.status_code} - {response.text}")
    return []


