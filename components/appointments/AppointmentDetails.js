"use client";

import { useState } from "react";
import { formatDateTime, getStatusText } from "@/helpers/statusHelper";
import MessageList from "@/components/appointments/MessageList";

export default function AppointmentDetail({ appointment, onMessageSent }) {
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

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

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    setSending(true);
    setError(null);

    try {
      const res = await fetch(`/api/appointments/${appointment.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: messageText }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Mesaj gönderilirken hata oluştu");
      }

      const newMessage = await res.json();
      onMessageSent(appointment.id, newMessage);
      setMessageText("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <div className="border-b border-gray-800 pb-4 mb-4">
        <h2 className="text-xl font-bold mb-4">Randevu Detayları</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-400">Tarih & Saat:</p>
            <p className="font-medium">
              {formatDateTime(appointment.date, appointment.time)}
            </p>
          </div>
          <div>
            <p className="text-gray-400">Durum:</p>
            {(() => {
              const { text, color } = getStatusLabel(appointment.status);
              return (
                <span
                  className={`inline-block px-2 py-1 text-xs font-semibold rounded ${color} text-white`}
                >
                  {text}
                </span>
              );
            })()}
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

        {!appointment?.messages?.length && (
          <div className="bg-gray-800 rounded p-3 max-h-64 overflow-y-auto mb-4">
            <p className="text-gray-400 text-center py-4">Henüz mesaj yok</p>
          </div>
        )}

        {appointment?.messages?.length > 0 && (
          <MessageList
            messages={appointment.messages}
            currentUser={appointment.user}
          />
        )}
        <form onSubmit={handleSendMessage}>
          <div className="flex">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Bir mesaj yazın..."
              className="flex-grow bg-gray-800 text-white px-4 py-2 rounded-l focus:outline-none"
              required
            />
            <button
              type="submit"
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-r"
              disabled={sending}
            >
              {sending ? "Gönderiliyor..." : "Gönder"}
            </button>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
}
