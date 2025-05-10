'use client';

import { useState } from 'react';

export default function AppointmentDetail({ appointment, onMessageSent }) {
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const formatDateTime = (date, time) => {
    const appointmentDate = new Date(date);
    const appointmentTime = new Date(time);
    
    const formattedDate = appointmentDate.toLocaleDateString();
    const formattedTime = appointmentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    return `${formattedDate} at ${formattedTime}`;
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    
    setSending(true);
    setError(null);
    
    try {
      const res = await fetch(`/api/appointments/${appointment.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: messageText })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to send message');
      }
      
      const newMessage = await res.json();
      onMessageSent(appointment.id, newMessage);
      setMessageText('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <div className="border-b border-gray-800 pb-4 mb-4">
        <h2 className="text-xl font-bold mb-4">Appointment Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-400">Date & Time:</p>
            <p className="font-medium">{formatDateTime(appointment.date, appointment.time)}</p>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-gray-400">Description:</p>
          <p className="mt-1 bg-gray-800 p-3 rounded">{appointment.description}</p>
        </div>
      </div>
      
      <div>
        <h3 className="font-bold mb-3">Messages</h3>
        <div className="bg-gray-800 rounded p-3 max-h-64 overflow-y-auto mb-4">
          {appointment.messages.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No messages yet</p>
          ) : (
            <div className="space-y-3">
              {appointment.messages.map(message => (
                <div key={message.id} className="bg-gray-700 rounded p-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{message.sender.name} {message.sender.surname}</span>
                    <span className="text-xs text-gray-400">
                      {new Date(message.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p>{message.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <form onSubmit={handleSendMessage}>
          <div className="flex">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type a message..."
              className="flex-grow bg-gray-800 text-white px-4 py-2 rounded-l focus:outline-none"
              required
            />
            <button 
              type="submit" 
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-r"
              disabled={sending}
            >
              {sending ? 'Sending...' : 'Send'}
            </button>
          </div>
          {error && (
            <p className="text-red-500 mt-2">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
}