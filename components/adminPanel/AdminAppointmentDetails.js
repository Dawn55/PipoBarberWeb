import { useState } from "react";
import { formatDateTime } from "@/helpers/statusHelper";
import MessageList from "@/components/appointments/MessageList";

export default function AdminAppointmentDetails({ 
  appointment, 
  onDeleteAppointment, 
  onStatusChange, 
  onSendMessage,
  currentUser
}) {
  const [messageText, setMessageText] = useState("");

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    
    const success = await onSendMessage(messageText);
    if (success) {
      setMessageText("");
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <div className="border-b border-gray-800 pb-4 mb-4">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-bold">Randevu Detayları</h2>
          <button
            onClick={() => onDeleteAppointment(appointment.id)}
            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
          >
            Sil
          </button>
        </div>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-400">Müşteri:</p>
            <p className="font-medium">
              {appointment.user.name} {appointment.user.surname}
            </p>
          </div>
          <div>
            <p className="text-gray-400">İletişim:</p>
            <p>{appointment.user.email}</p>
            <p>{appointment.user.phoneNumber}</p>
          </div>
          <div>
            <p className="text-gray-400">Tarih & Saat:</p>
            <p>{formatDateTime(appointment.date, appointment.time)}</p>
          </div>
          <div>
            <p className="text-gray-400">Durum:</p>
            <select
              value={appointment.status}
              onChange={(e) =>
                onStatusChange(appointment.id, parseInt(e.target.value))
              }
              className="bg-gray-800 text-white p-2 rounded mt-1"
            >
              <option value="0">Beklemede</option>
              <option value="1">Onaylandı</option>
              <option value="2">Reddedildi</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-gray-400">Açıklama:</p>
          <p className="mt-1 bg-gray-800 p-3 rounded">
            {appointment.description}
          </p>
        </div>
      </div>

      <div>
        <h3 className="font-bold mb-3">Mesajlar</h3>
        <MessageList 
          messages={appointment.messages} 
          currentUser={currentUser}
        />

        <form onSubmit={handleSendMessage}>
          <div className="flex">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Mesaj yazın..."
              className="flex-grow bg-gray-800 text-white px-4 py-2 rounded-l focus:outline-none"
              required
            />
            <button
              type="submit"
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-r"
            >
              Gönder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}