'use client';

import { format } from 'date-fns';

export default function AppointmentList({ 
  appointments, 
  onSelectAppointment, 
  selectedAppointmentId 
}) {
  const formatAppointmentTime = (timeString) => {
    const time = new Date(timeString);
    return format(time, 'h:mm a');
  };

  return (
    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
      {appointments.map((appointment) => (
        <div
          key={appointment.id}
          onClick={() => onSelectAppointment(appointment)}
          className={`p-4 rounded-lg cursor-pointer transition-all ${
            selectedAppointmentId === appointment.id
              ? 'bg-accent bg-opacity-20 border border-accent'
              : 'bg-secondary hover:bg-opacity-80'
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold text-white">
                {format(new Date(appointment.date), 'MMMM d, yyyy')}
              </p>
              <p className="text-gray-400">
                {formatAppointmentTime(appointment.time)}
              </p>
            </div>
            <div className="bg-primary px-2 py-1 rounded text-xs text-gray-300">
              {appointment.messages?.length || 0} message(s)
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-300 line-clamp-2">
            {appointment.description}
          </p>
        </div>
      ))}
    </div>
  );
}