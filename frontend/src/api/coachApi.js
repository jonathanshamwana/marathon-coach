import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

export const sendAudioAndStravaData = async (audioBlob) => {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'user_audio.wav');

  try {
    const response = await axios.post(`${API_BASE_URL}/api/coach/chat-to-coach`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error sending audio and Strava data:', error);
    throw error;
  }
};
