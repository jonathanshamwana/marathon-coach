import React, { useState, useEffect } from 'react';
import { FiMessageCircle } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import './ChatSidebar.css';

const dummyChats = [
    {
      date: 'May 5',
      message: "What should I eat before my long run? I usually feel sluggish halfway through, so I want to make sure I'm properly fueled beforehand and not relying just on caffeine."
    },
    {
      date: 'May 5',
      message: "Go for something high-carb and easy to digest, like toast with peanut butter and a banana. You can also consider a small coffee if you're used to it, but avoid anything new on race day."
    },
    {
      date: 'May 4',
      message: "How do I avoid shin splints? They keep coming back every time I increase my weekly mileage, and it's messing up my training schedule badly."
    },
    {
      date: 'May 4',
      message: "Make sure you're not ramping up mileage too fast. Add strength work for calves and hips, check your shoes, and try running on softer surfaces when possible."
    },
    {
      date: 'May 3',
      message: "Should I run if I'm sore from lifting? I had a tough leg day yesterday and I'm scheduled for a 10k run today—don't want to risk injury."
    },
    {
      date: 'May 3',
      message: "Light running is fine if it's just general soreness, but listen to your body. Skip the run or swap it for active recovery if your muscles are still too tight or tender."
    }
  ];
  

export default function ChatSidebar() {
  const [open, setOpen] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    const handleKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'o') {
        e.preventDefault();
        setOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Don't render anything if user is not authenticated
  if (!currentUser) {
    return null;
  }

  return (
    <>
      <div className="chat-toggle-icon" onClick={() => setOpen(!open)}>
        <FiMessageCircle size={28} />
      </div>

      <div className={`chat-sidebar ${open ? 'open' : ''}`}>
        <h2>Chat History</h2>
        <div className="chat-messages">
          {dummyChats.map((chat, i) => (
            <div key={i} className="chat-bubble">
              <strong className="chat-date">{chat.date}</strong>
              <p className="chat-snippet">{chat.message}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
