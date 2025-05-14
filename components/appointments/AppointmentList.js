"use client";

import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { getStatusText } from "@/helpers/statusHelper";

export default function AppointmentList({
  appointments,
  onSelectAppointment,
  selectedAppointmentId,
}) {
  const formatAppointmentTime = (timeString) => {
    const time = new Date(timeString);
    return format(time, "HH:mm", { locale: tr });
  };

  const getStatusLabel = (status) => {
    const text = getStatusText(status);
    
    switch (status) {
      case 0:
        return { text, color: "bg-yellow-600" };
      case 1:
        return { text, color: "bg-green-600" };
      case 2:
        return { text, color: "bg-red-600" };
      default:
        return { text, color: "bg-gray-600" };
    }
  };

  return (
    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
      {appointments.map((appointment) => (
        <div
          key={appointment.id}
          onClick={() => onSelectAppointment(appointment)}
          className={`p-4 rounded-lg cursor-pointer transition-all ${
            selectedAppointmentId === appointment.id
              ? "bg-accent bg-opacity-20 border border-accent"
              : "bg-secondary hover:bg-opacity-80"
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold text-white">
                {format(new Date(appointment.date), "d MMMM yyyy", { locale: tr })}
              </p>
              <p className="text-gray-400">
                {formatAppointmentTime(appointment.time)}
              </p>
            </div>
            <div className="flex flex-col items-end space-y-1">
              <div className="bg-primary px-2 py-1 rounded text-xs text-gray-300">
                {appointment.messages?.length || 0} mesaj
              </div>
              {(() => {
                const { text, color } = getStatusLabel(appointment.status);
                return (
                  <span
                    className={`text-xs px-2 py-1 rounded ${color} text-white`}
                  >
                    {text}
                  </span>
                );
              })()}
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