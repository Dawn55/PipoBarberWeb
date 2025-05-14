"use client";

import { useState,useEffect } from "react";

export default function GuestAppointmentDetail({
  appointment: initialAppointment,
}) {
  const [appointment, setAppointment] = useState(initialAppointment);
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const getStatusLabel = (status) => {
    switch (status) {
      case 0:
        return { text: "Bekliyor", color: "bg-yellow-600" };
      case 1:
        return { text: "Onaylandı", color: "bg-green-600" };
      case 2:
        return { text: "İptal Edildi", color: "bg-red-600" };
      default:
        return { text: "Bilinmiyor", color: "bg-gray-600" };
    }
  };
    useEffect(() => {
      if (appointment) {
        console.log(appointment)
      }
    }, [appointment]);

  const formatDateTime = (date, time) => {
    const appointmentDate = new Date(date);
    const appointmentTime = new Date(time);

    const formattedDate = appointmentDate.toLocaleDateString("tr-TR");
    const formattedTime = appointmentTime.toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return `${formattedDate} ${formattedTime}`;
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    const tempMessage = {
      id: Date.now(),
      text: messageText,
      sender: { name: "Siz", surname: "" },
      createdAt: new Date().toISOString(),
    };

    setAppointment((prev) => ({
      ...prev,
      messages: [...prev.messages, tempMessage],
    }));

    setMessageText("");
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
        throw new Error(errorData.error || "Mesaj gönderilemedi");
      }

      const newMessage = await res.json();

      setAppointment((prev) => ({
        ...prev,
        messages: prev.messages.map((msg) =>
          msg.id === tempMessage.id ? newMessage : msg
        ),
      }));
    } catch (err) {
      setAppointment((prev) => ({
        ...prev,
        messages: prev.messages.filter((msg) => msg.id !== tempMessage.id),
      }));
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <div className="bg-yellow-700 text-yellow-100 p-4 rounded mb-6 border-l-4 border-yellow-400">
        <h3 className="font-bold text-lg mb-2">🔐 Önemli Bilgilendirme</h3>
        <p>
          Bu sayfa sadece bu bağlantı ile görüntülenebilir. Lütfen bu bağlantıyı
          kaybetmeyin, aksi takdirde randevunuza tekrar erişemezsiniz.
          Görüntüleme yapamaz ve mesaj ekleyemezsiniz.
        </p>
        <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2">
          <input
            type="text"
            value={window.location.href}
            readOnly
            className="bg-gray-800 px-3 py-2 rounded text-white w-full sm:w-auto flex-1"
          />
          <button
            onClick={handleCopyLink}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-2 rounded"
          >
            {copied ? "Kopyalandı!" : "Bağlantıyı Kopyala"}
          </button>
        </div>
      </div>

      <div className="border-b border-gray-800 pb-4 mb-4">
        <h2 className="text-xl font-bold mb-4 text-white">Randevu Detayları</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-400">Tarih & Saat:</p>
            <p className="font-medium text-white">
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
          <p className="mt-1 bg-gray-800 p-3 rounded text-white">
            {appointment.description}
          </p>
        </div>
      </div>

      <div>
        <h3 className="font-bold mb-3 text-white">Mesajlar</h3>
        <div className="bg-gray-800 rounded p-3 max-h-64 overflow-y-auto mb-4">
          {appointment.messages.length === 0 ? (
            <p className="text-gray-400 text-center py-4">Henüz mesaj yok</p>
          ) : (
            <div className="space-y-3">
              {appointment.messages.map((message) => (
                <div key={message.id} className="bg-gray-700 rounded p-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-white">
                      {message.sender?.name || "Siz"}{" "}
                      {message.sender?.surname || ""}
                      {message.sender.isAdmin && (
                        <span className="ml-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded">
                          Yönetici
                        </span>
                      )}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(message.createdAt).toLocaleString("tr-TR")}
                    </span>
                  </div>
                  <p className="text-white">{message.text}</p>
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
              placeholder="Mesaj yazın..."
              className="flex-grow bg-gray-800 text-white px-4 py-2 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r text-white transition-colors"
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
