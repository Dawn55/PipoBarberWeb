import { formatDateTime, getStatusText } from "@/helpers/statusHelper";

export default function AdminAppointmentsList({ appointments, selectedAppointment, setSelectedAppointment }) {
  // Sort appointments by createdAt (newest first)
  const sortedAppointments = [...appointments].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="md:col-span-1 bg-gray-900 rounded-lg p-4 h-min">
      <h2 className="text-xl font-bold mb-4">Tüm Randevular</h2>
      {sortedAppointments.length === 0 ? (
        <p className="text-gray-400">Randevu bulunamadı.</p>
      ) : (
        <ul className="space-y-2">
          {sortedAppointments.map((appointment) => (
            <li
              key={appointment.id}
              className={`p-3 rounded cursor-pointer ${
                selectedAppointment?.id === appointment.id
                  ? "bg-gray-700"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
              onClick={() => setSelectedAppointment(appointment)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">
                    {appointment.user.name} {appointment.user.surname}
                  </p>
                  <p className="text-sm text-gray-400">
                    {formatDateTime(appointment.date, appointment.time)}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    appointment.status === 0
                      ? "bg-yellow-600"
                      : appointment.status === 1
                      ? "bg-green-600"
                      : appointment.status === 2
                      ? "bg-red-600"
                      : "bg-blue-600"
                  }`}
                >
                  {getStatusText(appointment.status)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}