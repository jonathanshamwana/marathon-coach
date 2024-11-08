import React, { useState, useRef } from 'react';
import { LinearProgress } from '@mui/material';
import { sendAudioAndStravaData } from '../api/coachApi';
import Wavify from 'react-wavify';
import '../styles/Home.css';

function Home() {
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [isCoachSpeaking, setIsCoachSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null);

  const handleRecord = async () => {
    if (isRecording) {
      // Stop recording
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    } else {
      // Start recording
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          mediaRecorderRef.current = new MediaRecorder(stream);

          const audioChunks = [];
          mediaRecorderRef.current.ondataavailable = (event) => {
            audioChunks.push(event.data);
          };

          mediaRecorderRef.current.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            stream.getTracks().forEach(track => track.stop()); // Stop all audio tracks
            sendAudioToBackend(audioBlob);
          };

          mediaRecorderRef.current.start();
          setIsRecording(true);
        } catch (err) {
          console.error("Error accessing audio media:", err);
        }
      } else {
        alert("Audio recording is not supported in this browser.");
      }
    }
  };

  const sendAudioToBackend = async (audioBlob) => {
    setIsLoading(true);

    // Simulate a delay (e.g., for backend processing)
    setTimeout(() => {
      setIsLoading(false);
      setIsCoachSpeaking(true);

      if (audioRef.current) {
        audioRef.current.play();
      }

      // Simulate coach speaking duration
      setTimeout(() => {
        setIsCoachSpeaking(false);
      }, 10000); // Coach speaks for 5 seconds
    }, 5000); // Simulate 5-second processing delay
  };

  // const handleRecord = async () => {
  //   if (isRecording) {
  //     mediaRecorderRef.current.stop();
  //     setIsRecording(false);
  //   } else {
  //     if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  //       try {
  //         const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  //         mediaRecorderRef.current = new MediaRecorder(stream);

  //         const audioChunks = [];
  //         mediaRecorderRef.current.ondataavailable = (event) => {
  //           audioChunks.push(event.data);
  //         };

  //         mediaRecorderRef.current.onstop = () => {
  //           const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
  //           sendToBackend(audioBlob);
  //         };

  //         mediaRecorderRef.current.start();
  //         setIsRecording(true);
  //       } catch (err) {
  //         console.error('Error accessing audio media:', err);
  //       }
  //     }
  //   }
  // };

  // const sendToBackend = async (audioBlob) => {
  //   setIsLoading(true);

  //   try {
  //     const response = await sendAudioAndStravaData(audioBlob);
  //     if (audioRef.current) {
  //       audioRef.current.src = `data:audio/wav;base64,${response.audio_response}`;
  //       audioRef.current.play();
  //     }
  //   } catch (error) {
  //     console.error('Error sending data to backend:', error);
  //   } finally {
  //     setIsLoading(false);
  //     setIsCoachSpeaking(true);
  //     setTimeout(() => setIsCoachSpeaking(false), 5000);
  //   }
  // };

  return (
    <div className="home-container">
      <div className="animated-background"></div>
      <h1 className="home-heading patrick-hand-regular">26Coach</h1>
      <h3 className="home-subheading patrick-hand-regular">THE MARATHON COACH THAT LIVES IN YOUR AIRPODS</h3>
      <div className="cta-container">
        <button 
          onClick={handleRecord} 
          className={`cta-button ${isRecording ? 'pulse' : ''}`}
        >
          {isRecording ? 'Recording...' : 'Speak to 26Coach'}
        </button>
      </div>

      {/* Loading indicator shown when "processing" */}
      {isLoading && (
        <div className="loading-bar">
          <LinearProgress color="secondary" />
        </div>
      )}

      {/* Placeholder audio element for coach response */}
      <audio ref={audioRef} src="/audio/marathon-coach.wav" />

      <div className={`wave-container ${isCoachSpeaking ? 'fade-in' : 'fade-out'}`}>
        {isCoachSpeaking && (
          <Wavify 
            fill="#DE7C7D"
            paused={false}
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

  // return (
  //   <div className="home-container">
  //     <div className="animated-background"></div>
  //     <h1 className="home-heading patrick-hand-regular">26Coach</h1>
  //     <h3 className="home-subheading patrick-hand-regular">THE MARATHON COACH THAT LIVES IN YOUR AIRPODS</h3>
  //     <div className="cta-container">
  //       <button onClick={handleRecord} className={`cta-button ${isRecording ? 'pulse' : ''}`}>
  //         {isRecording ? 'Recording...' : 'Speak to 26Coach'}
  //       </button>
  //     </div>

  //     {isLoading && (
  //       <div className="loading-bar">
  //         <LinearProgress color="secondary" />
  //       </div>
  //     )}

  //     <audio ref={audioRef} />

  //     <div className={`wave-container ${isCoachSpeaking ? 'fade-in' : 'fade-out'}`}>
  //       {isCoachSpeaking && (
  //         <Wavify fill="#DE7C7D" paused={false} options={{ height: 30, amplitude: 25, speed: 0.8, points: 4 }} />
  //       )}
  //     </div>
  //   </div>
  // );
}

export default Home;

