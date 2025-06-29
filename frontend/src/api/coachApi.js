import axios from 'axios';

// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const sendAudioAndStravaData = async (audioBlob) => {
  const formData = new FormData();
  // Key 'audio' matches backend `request.files['audio']`. Good.
  // Filename 'user_audio.wav' is sent, but ensure the actual Blob type is what your backend expects/handles.
  // If your React recorder is using webm, this filename is just a suggestion.
  formData.append('audio', audioBlob, 'user_audio.wav');

  try {
    // Consider removing the explicit 'Content-Type' header here.
    // Axios usually sets it correctly automatically (including the necessary boundary)
    // when you pass FormData as the body. Setting it manually can sometimes cause issues.
    const response = await axios.post(`${API_BASE_URL}/api/coach/chat-to-coach`, formData/*, {
      // It's often better to let Axios handle this header with FormData
      // headers: {
      //  'Content-Type': 'multipart/form-data',
      // },
    }*/);
    return response.data; // Assuming backend returns JSON like { audio_response: "base64..." }
  } catch (error) {
    // Improve error handling slightly: log the specific error type if available
    console.error('Error sending audio data:', error.response ? error.response.data : error.message);
    // Re-throwing allows the calling component (HomePage.jsx) to catch and display it
    throw error;
  }
};
