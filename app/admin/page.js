'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminPanel() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('appointments');
  const [appointments, setAppointments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || !session.user.isAdmin) {
      router.push('/login');
      return;
    }
    
    fetchData();
  }, [session, status, router, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (activeTab === 'appointments') {
        const res = await fetch('/api/appointments');
        if (!res.ok) throw new Error('Failed to fetch appointments');
        const data = await res.json();
        setAppointments(data);
      } else if (activeTab === 'users') {
        const res = await fetch('/api/users');
        if (!res.ok) throw new Error('Failed to fetch users');
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, isAdmin) => {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAdmin })
      });
      
      if (!res.ok) throw new Error('Failed to update user role');
      
      setUsers(users.map(user => 
        user.id === userId ? { ...user, isAdmin } : user
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedAppointment) return;
    
    try {
      const res = await fetch(`/api/appointments/${selectedAppointment.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: messageText })
      });
      
      if (!res.ok) throw new Error('Failed to send message');
      
      const newMessage = await res.json();
      
      setAppointments(appointments.map(apt => 
        apt.id === selectedAppointment.id 
          ? { ...apt, messages: [...apt.messages, newMessage] } 
          : apt
      ));
      
      setSelectedAppointment({
        ...selectedAppointment,
        messages: [...selectedAppointment.messages, newMessage]
      });
      
      setMessageText('');
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDateTime = (date, time) => {
    const appointmentDate = new Date(date);
    const appointmentTime = new Date(time);
    
    const formattedDate = appointmentDate.toLocaleDateString();
    const formattedTime = appointmentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    return `${formattedDate} at ${formattedTime}`;
  };

  if (loading && status !== 'loading') return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      <div className="bg-red-800 text-white p-4 rounded">
        Error: {error}
      </div>
      <button 
        className="mt-4 bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded"
        onClick={fetchData}
      >
        Try Again
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      
      <div className="flex mb-6 border-b border-gray-800">
        <button 
          className={`py-2 px-4 mr-2 ${activeTab === 'appointments' ? 'border-b-2 border-white font-bold' : ''}`}
          onClick={() => setActiveTab('appointments')}
        >
          Appointments
        </button>
        <button 
          className={`py-2 px-4 ${activeTab === 'users' ? 'border-b-2 border-white font-bold' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
      </div>
      
      {activeTab === 'appointments' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-gray-900 rounded-lg p-4 h-min">
            <h2 className="text-xl font-bold mb-4">All Appointments</h2>
            {appointments.length === 0 ? (
              <p className="text-gray-400">No appointments found.</p>
            ) : (
              <ul className="space-y-2">
                {appointments.map(appointment => (
                  <li 
                    key={appointment.id}
                    className={`p-3 rounded cursor-pointer ${selectedAppointment?.id === appointment.id ? 'bg-gray-700' : 'bg-gray-800 hover:bg-gray-700'}`}
                    onClick={() => setSelectedAppointment(appointment)}
                  >
                    <p className="font-medium">{appointment.user.name} {appointment.user.surname}</p>
                    <p className="text-sm text-gray-400">{formatDateTime(appointment.date, appointment.time)}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="md:col-span-2 bg-gray-900 rounded-lg p-4">
            {!selectedAppointment ? (
              <div className="flex items-center justify-center h-full text-gray-400">
                <p>Select an appointment to view details</p>
              </div>
            ) : (
              <>
                <div className="border-b border-gray-800 pb-4 mb-4">
                  <h2 className="text-xl font-bold">Appointment Details</h2>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400">Client:</p>
                      <p className="font-medium">{selectedAppointment.user.name} {selectedAppointment.user.surname}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Contact:</p>
                      <p>{selectedAppointment.user.email}</p>
                      <p>{selectedAppointment.user.phoneNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Date & Time:</p>
                      <p>{formatDateTime(selectedAppointment.date, selectedAppointment.time)}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-gray-400">Description:</p>
                    <p className="mt-1 bg-gray-800 p-3 rounded">{selectedAppointment.description}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-bold mb-3">Messages</h3>
                  <div className="bg-gray-800 rounded p-3 max-h-64 overflow-y-auto mb-4">
                    {selectedAppointment.messages.length === 0 ? (
                      <p className="text-gray-400 text-center py-4">No messages yet</p>
                    ) : (
                      <div className="space-y-3">
                        {selectedAppointment.messages.map(message => (
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
                      >
                        Send
                      </button>
                    </div>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      
      {activeTab === 'users' && (
        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">All Users</h2>
          {users.length === 0 ? (
            <p className="text-gray-400">No users found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left bg-gray-800">
                    <th className="p-3 rounded-tl">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Role</th>
                    <th className="p-3 rounded-tr">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} className="border-t border-gray-800">
                      <td className="p-3">{user.name} {user.surname}</td>
                      <td className="p-3">{user.email}</td>
                      <td className="p-3">{user.phoneNumber}</td>
                      <td className="p-3">{user.isAdmin ? 'Admin' : 'User'}</td>
                      <td className="p-3">
                        <select 
                          value={user.isAdmin ? 'admin' : 'user'}
                          onChange={(e) => handleRoleChange(user.id, e.target.value === 'admin')}
                          className="bg-gray-800 text-white p-2 rounded"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}