import React, { useState, useRef, useEffect } from 'react';
import { LinearProgress } from '@mui/material';
import { sendAudioAndStravaData } from '../api/coachApi';
import ErrorMessage from '../components/General/ErrorMessage';
import ChatSidebar from '../components/Coach/ChatSidebar';
import Wavify from 'react-wavify';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Home.css';

function Home() {
  const { currentUser } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCoachSpeaking, setIsCoachSpeaking] = useState(false);
  const [error, setError] = useState(null);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistLoading, setWaitlistLoading] = useState(false);
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]); 
  const audioRef = useRef(null);
  const streamRef = useRef(null); 

  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    const handleAudioEnd = () => {
      console.log('Coach audio finished playing.');
      setIsCoachSpeaking(false);
    };

    audioElement.addEventListener('ended', handleAudioEnd);

    return () => {
      audioElement.removeEventListener('ended', handleAudioEnd);
    };
  }, []);

  const handleRecord = async () => {
    setError(null); 

    // If user is not authenticated, play default audio preview
    if (!currentUser) {
      setIsLoading(true);
      try {
        // Play the default audio preview
        const audioElement = audioRef.current;
        audioElement.src = '/audio/26club-audio-preview.mov';
        await audioElement.play();
        setIsCoachSpeaking(true);
        console.log('Playing default audio preview...');
      } catch (error) {
        console.error('Error playing default audio:', error);
        setError('Unable to play audio preview. Please try again.');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Original AI chat logic for authenticated users
    if (isRecording) {
      // --- Stop Recording ---
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop(); 
        console.log('Stopping recording...');
      }
    } else {
      // --- Start Recording ---
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          streamRef.current = stream;
          
          const options = { mimeType: 'audio/webm' }; 
          try {
             mediaRecorderRef.current = new MediaRecorder(stream, options);
          } catch (e) {
            console.warn("audio/webm not supported, trying default.", e)
            mediaRecorderRef.current = new MediaRecorder(stream);
          }
          
          console.log("Using MIME type:", mediaRecorderRef.current.mimeType);

          audioChunksRef.current = [];

          mediaRecorderRef.current.ondataavailable = (event) => {
            if (event.data.size > 0) {
              audioChunksRef.current.push(event.data);
            }
          };

          // ON STOP: Process and Send Audio
          mediaRecorderRef.current.onstop = () => {
            console.log('Recording stopped via onstop.');
            const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorderRef.current.mimeType });
            
            // Important: Stop tracks *after* the blob is created
            streamRef.current?.getTracks().forEach(track => track.stop());
            streamRef.current = null;

            setIsRecording(false);
            sendToBackend(audioBlob);
          };

          // ON ERROR: Handle Recording Errors 
           mediaRecorderRef.current.onerror = (event) => {
                console.error("MediaRecorder error:", event.error);
                setError("Whoops, your coach has DOMs so they couldn't respond.");
                streamRef.current?.getTracks().forEach(track => track.stop());
                streamRef.current = null;
                setIsRecording(false);
                setIsLoading(false);
           };


          mediaRecorderRef.current.start();
          setIsRecording(true);
          console.log('Recording started...');

        } catch (err) {
          console.error("Error accessing audio media:", err);
          let userMessage = `Could not access microphone: ${err.message}.`;
          if (err.name === 'NotAllowedError') {
            userMessage += ' Please grant microphone permission in your browser settings.';
          } else if (err.name === 'NotFoundError') {
             userMessage = 'No microphone found. Please ensure one is connected and enabled.';
          }
          setError(userMessage);
          setIsRecording(false); 
        }
      } else {
        const message = "Audio recording is not supported in this browser.";
        alert(message);
        setError(message);
      }
    }
  };

  // Send Audio Blob to Backend
  const sendToBackend = async (audioBlob) => {
     if (!audioBlob || audioBlob.size === 0) {
        console.warn("Attempted to send empty audio blob.");
        setError("We couldn't capture your audio. Please try speaking clearly.");
        return;
     }

     console.log(`Sending audio blob: size=${audioBlob.size}, type=${audioBlob.type}`);
     setIsLoading(true);
     setError(null); 

     try {
       // --- API CALL ---
       const response = await sendAudioAndStravaData(audioBlob);

       if (audioRef.current && response && response.audio_response) {
         // --- Play Coach Response ---
         const audioMimeType = "audio/wav"; // IMPORTANT: Must match backend's output format
         audioRef.current.src = `data:${audioMimeType};base64,${response.audio_response}`;

         // Play the audio returned from the backend
         await audioRef.current.play();
         console.log("Coach audio playback started...");
         setIsCoachSpeaking(true); 

       } else {
         // Handle cases where the response might be invalid or missing data
         console.error("Invalid response structure or missing audio data:", response);
         setError("Received an unexpected response from the coach. Please try again.");
       }

     } catch (error) {
       console.error('Error sending data to backend or playing audio:', error);
       setError(`Communication error with the coach. Please check connection and try again.`);
       setIsCoachSpeaking(false); // Ensure coach animation stops on error
     } finally {
       setIsLoading(false); // Hide loading indicator
     }
  };

  const handleWaitlistSubmit = async (e) => {
    e.preventDefault();
    
    if (!waitlistEmail.trim()) {
      return;
    }
    
    setWaitlistLoading(true);
    
    try {
      // Submit to Beehiiv newsletter
      const response = await fetch('https://26club.beehiiv.com/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: waitlistEmail.trim(),
        }),
      });
      
      if (response.ok) {
        setWaitlistSuccess(true);
        setWaitlistEmail('');
        
        // Reset success message after 3 seconds
        setTimeout(() => {
          setWaitlistSuccess(false);
        }, 3000);
      } else {
        throw new Error('Failed to subscribe');
      }
      
    } catch (error) {
      console.error('Failed to join waitlist:', error);
      // Still show success to user even if there's an error, to avoid confusion
      setWaitlistSuccess(true);
      setWaitlistEmail('');
      
      setTimeout(() => {
        setWaitlistSuccess(false);
      }, 3000);
    } finally {
      setWaitlistLoading(false);
    }
  };

  return (
    <div className="home-container">
      <ChatSidebar />
      <div className="animated-background"></div>
      
      {/* Hero Section with Image */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="home-heading patrick-hand-regular">26Club</h1>
          <h3 className="home-subheading patrick-hand-regular">The AI Marathon Coach for Everyday Runners</h3>
          <div className="cta-container">
            <button
              onClick={handleRecord}
              className={`cta-button ${isRecording ? 'pulse' : ''}`}
              disabled={isLoading || isCoachSpeaking}
            >
              {isRecording ? 'Stop Recording...' : 
               isLoading ? 'Processing...' : 
               currentUser ? 'Chat to Coach' : 'Hear from Coach'}
            </button>
            
            <div className="waitlist-container">
              <p className="waitlist-text">Join our waitlist for early access</p>
              <form onSubmit={handleWaitlistSubmit} className="waitlist-form">
                <input
                  type="email"
                  value={waitlistEmail}
                  onChange={(e) => setWaitlistEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="waitlist-input"
                  required
                  disabled={waitlistLoading}
                />
                <button 
                  type="submit" 
                  className="waitlist-button"
                  disabled={waitlistLoading || !waitlistEmail.trim()}
                >
                  {waitlistLoading ? 'Joining...' : 'Join Waitlist'}
                </button>
              </form>
              {waitlistSuccess && (
                <p className="waitlist-success">Thanks! You're now subscribed to the 26Club newsletter.</p>
              )}
            </div>
          </div>
        </div>
        <div className="hero-image">
          <img src="/images/26CLUB.jpg" alt="26Club" className="club-image" />
        </div>
      </div>
      
      {isLoading && (
        <div className="loading-bar">
          <LinearProgress color="secondary" />
          <p className='loading-text'>
            {currentUser ? 'Coach is thinking...' : 'Loading preview...'}
          </p> 
        </div>
      )}

       {error && ErrorMessage(error)}
      <audio ref={audioRef} style={{ display: 'none' }} />

      <div className={`wave-container ${isCoachSpeaking ? 'fade-in' : 'fade-out'}`}>
        {isCoachSpeaking && (
          <Wavify
            fill="#740938"
            paused={!isCoachSpeaking}
            options={{
              height: 30,
              amplitude: 25,
              speed: 0.8,
              points: 4,
            }}
          />
        )}
      </div>
    </div>
  );
}

export default Home;