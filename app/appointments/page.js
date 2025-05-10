'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { format } from 'date-fns';
import NewAppointmentForm from '@/components/appointments/AppointmentForm';
import AppointmentList from '@/components/appointments/AppointmentList';
import AppointmentDetails from '@/components/appointments/AppointmentDetails';

export default function Appointments() {
  const { data: session } = useSession();
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showNewForm, setShowNewForm] = useState(false);
  
  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/appointments');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch appointments');
      }
      
      setAppointments(data);
    } catch (error) {
      setError('Error loading appointments: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setShowNewForm(false);
  };

  const handleNewAppointmentClick = () => {
    setSelectedAppointment(null);
    setShowNewForm(true);
  };

  const handleAppointmentCreated = (newAppointment) => {
    setAppointments([...appointments, newAppointment]);
    setShowNewForm(false);
    setSelectedAppointment(newAppointment);
  };

  const handleMessageAdded = (appointmentId, message) => {
    setAppointments(
      appointments.map((appointment) => {
        if (appointment.id === appointmentId) {
          return {
            ...appointment,
            messages: [...(appointment.messages || []), message],
          };
        }
        return appointment;
      })
    );
    
    if (selectedAppointment && selectedAppointment.id === appointmentId) {
      setSelectedAppointment({
        ...selectedAppointment,
        messages: [...(selectedAppointment.messages || []), message],
      });
    }
  };

  return (
    <div className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/3 mb-6 lg:mb-0 lg:pr-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-white">Your Appointments</h1>
              <button
                onClick={handleNewAppointmentClick}
                className="btn btn-primary"
              >
                New Appointment
              </button>
            </div>
            
            {isLoading ? (
              <div className="text-center py-10">
                <div className="text-accent">Loading appointments...</div>
              </div>
            ) : error ? (
              <div className="bg-red-500 text-white p-4 rounded-md">
                {error}
              </div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-400 mb-4">You don't have any appointments yet.</p>
                <button
                  onClick={handleNewAppointmentClick}
                  className="btn btn-primary"
                >
                  Book Your First Appointment
                </button>
              </div>
            ) : (
              <AppointmentList 
                appointments={appointments} 
                onSelectAppointment={handleSelectAppointment}
                selectedAppointmentId={selectedAppointment?.id}
              />
            )}
          </div>
          
          <div className="lg:w-2/3 lg:pl-6 border-t lg:border-t-0 lg:border-l border-secondary pt-6 lg:pt-0 lg:pl-6">
            {showNewForm ? (
              <div className="card">
                <h2 className="text-xl font-bold mb-4">Book a New Appointment</h2>
                <NewAppointmentForm 
                  onAppointmentCreated={handleAppointmentCreated}
                  onCancel={() => setShowNewForm(false)}
                />
              </div>
            ) : selectedAppointment ? (
              <AppointmentDetails 
                appointment={selectedAppointment}
                onMessageAdded={handleMessageAdded}
                currentUserId={parseInt(session?.user?.id)}
                isAdmin={session?.user?.isAdmin}
              />
            ) : (
              <div className="text-center py-20 px-4">
                <h2 className="text-xl font-semibold text-gray-400 mb-4">
                  Select an appointment to view details or book a new one
                </h2>
                <button
                  onClick={handleNewAppointmentClick}
                  className="btn btn-primary"
                >
                  Book New Appointment
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}