"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminPanel() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("appointments");
  const [appointments, setAppointments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [messageText, setMessageText] = useState("");

  useEffect(() => {
    if (status === "loading") return;

    if (!session || !session.user.isAdmin) {
      router.push("/login");
      return;
    }

    fetchData();
  }, [session, status, router, activeTab]);
  useEffect(() => {
    if (selectedAppointment) {
      console.log(selectedAppointment.messages)
      console.log(
        "Tüm Mesajlar:",
        selectedAppointment.messages.map((msg) => ({
          id: msg.id,
          sender: {
            id: msg.sender.id,
            name: msg.sender.name,
            isAdmin: msg.sender.isAdmin, // undefined geliyor mu kontrol edin
          },
        }))
      );
    }
  }, [selectedAppointment]);

  // 2. Test için sabit veri kullanın (geçici çözüm)
  const testMessages =
    selectedAppointment?.messages.map((msg) => ({
      ...msg,
      sender: {
        ...msg.sender,
        isAdmin: msg.sender.id === 13, // mari buach için true
      },
    })) || [];

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      if (activeTab === "appointments") {
        const res = await fetch("/api/appointments");
        if (!res.ok) throw new Error("Randevular alınamadı");
        const data = await res.json();
        setAppointments(data);
      } else if (activeTab === "users") {
        const res = await fetch("/api/users");
        if (!res.ok) throw new Error("Kullanıcılar alınamadı");
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
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAdmin }),
      });

      if (!res.ok) throw new Error("Kullanıcı rolü güncellenemedi");

      setUsers(
        users.map((user) => (user.id === userId ? { ...user, isAdmin } : user))
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (
      !confirm(
        "Bu kullanıcıyı silmek istediğinize emin misiniz? Bu işlem geri alınamaz!"
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Kullanıcı silinemedi");

      setUsers(users.filter((user) => user.id !== userId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    if (!confirm("Bu randevuyu silmek istediğinize emin misiniz?")) {
      return;
    }

    try {
      const res = await fetch(`/api/appointments/${appointmentId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Randevu silinemedi");

      setAppointments(appointments.filter((apt) => apt.id !== appointmentId));
      setSelectedAppointment(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleStatusChange = async (appointmentId, status) => {
    try {
      const res = await fetch(`/api/appointments/${appointmentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Randevu durumu güncellenemedi");

      setAppointments(
        appointments.map((apt) =>
          apt.id === appointmentId ? { ...apt, status } : apt
        )
      );

      if (selectedAppointment?.id === appointmentId) {
        setSelectedAppointment({ ...selectedAppointment, status });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedAppointment) return;

    try {
      const res = await fetch(
        `/api/appointments/${selectedAppointment.id}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: messageText }),
        }
      );

      if (!res.ok) throw new Error("Mesaj gönderilemedi");

      const newMessage = await res.json();

      setAppointments(
        appointments.map((apt) =>
          apt.id === selectedAppointment.id
            ? { ...apt, messages: [...apt.messages, newMessage] }
            : apt
        )
      );

      setSelectedAppointment({
        ...selectedAppointment,
        messages: [...selectedAppointment.messages, newMessage],
      });
      console.log("Messages:", selectedAppointment.messages);

      setMessageText("");
    } catch (err) {
      setError(err.message);
    }
  };

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

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return "Beklemede";
      case 1:
        return "Onaylandı";
      case 2:
        return "Reddedildi";
      default:
        return "Bilinmeyen";
    }
  };

  if (loading && status !== "loading")
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <h1 className="text-3xl font-bold mb-6">Yönetici Paneli</h1>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <h1 className="text-3xl font-bold mb-6">Yönetici Paneli</h1>
        <div className="bg-red-800 text-white p-4 rounded">Hata: {error}</div>
        <button
          className="mt-4 bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded"
          onClick={fetchData}
        >
          Tekrar Dene
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Yönetici Paneli</h1>

      <div className="flex mb-6 border-b border-gray-800">
        <button
          className={`py-2 px-4 mr-2 ${
            activeTab === "appointments"
              ? "border-b-2 border-white font-bold"
              : ""
          }`}
          onClick={() => setActiveTab("appointments")}
        >
          Randevular
        </button>
        <button
          className={`py-2 px-4 ${
            activeTab === "users" ? "border-b-2 border-white font-bold" : ""
          }`}
          onClick={() => setActiveTab("users")}
        >
          Kullanıcılar
        </button>
      </div>

      {activeTab === "appointments" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-gray-900 rounded-lg p-4 h-min">
            <h2 className="text-xl font-bold mb-4">Tüm Randevular</h2>
            {appointments.length === 0 ? (
              <p className="text-gray-400">Randevu bulunamadı.</p>
            ) : (
              <ul className="space-y-2">
                {appointments.map((appointment) => (
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

          <div className="md:col-span-2 bg-gray-900 rounded-lg p-4">
            {!selectedAppointment ? (
              <div className="flex items-center justify-center h-full text-gray-400">
                <p>Detayları görmek için bir randevu seçin</p>
              </div>
            ) : (
              <>
                <div className="border-b border-gray-800 pb-4 mb-4">
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-bold">Randevu Detayları</h2>
                    <button
                      onClick={() =>
                        handleDeleteAppointment(selectedAppointment.id)
                      }
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                    >
                      Sil
                    </button>
                  </div>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400">Müşteri:</p>
                      <p className="font-medium">
                        {selectedAppointment.user.name}{" "}
                        {selectedAppointment.user.surname}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">İletişim:</p>
                      <p>{selectedAppointment.user.email}</p>
                      <p>{selectedAppointment.user.phoneNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Tarih & Saat:</p>
                      <p>
                        {formatDateTime(
                          selectedAppointment.date,
                          selectedAppointment.time
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Durum:</p>
                      <select
                        value={selectedAppointment.status}
                        onChange={(e) =>
                          handleStatusChange(
                            selectedAppointment.id,
                            parseInt(e.target.value)
                          )
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
                      {selectedAppointment.description}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold mb-3">Mesajlar</h3>
                  <div className="bg-gray-800 rounded p-3 max-h-64 overflow-y-auto mb-4">
                    {selectedAppointment.messages.length === 0 ? (
                      <p className="text-gray-400 text-center py-4">
                        Henüz mesaj yok
                      </p>
                    ) : (
                      <div className="space-y-3">
                                                {selectedAppointment.messages.map((message) => (
                          <div
                            key={message.id}
                            className="mb-4 p-3 bg-gray-800 rounded"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="font-medium">
                                  {message.sender.name} {message.sender.surname}
                                </span>
                                {message.sender.isAdmin && (
                                  <span className="ml-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded">
                                    Yönetici
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-gray-400">
                                {new Date(message.createdAt).toLocaleString(
                                  "tr-TR"
                                )}
                              </span>
                            </div>
                            <p className="mt-1">{message.text}</p>
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
              </>
            )}
          </div>
        </div>
      )}

      {activeTab === "users" && (
        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Tüm Kullanıcılar</h2>
          {users.length === 0 ? (
            <p className="text-gray-400">Kullanıcı bulunamadı.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left bg-gray-800">
                    <th className="p-3 rounded-tl">Ad Soyad</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Telefon</th>
                    <th className="p-3">Rol</th>
                    <th className="p-3 rounded-tr">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-t border-gray-800">
                      <td className="p-3">
                        {user.name} {user.surname}
                      </td>
                      <td className="p-3">{user.email}</td>
                      <td className="p-3">{user.phoneNumber}</td>
                      <td className="p-3">
                        <select
                          value={user.isAdmin ? "admin" : "user"}
                          onChange={(e) =>
                            handleRoleChange(
                              user.id,
                              e.target.value === "admin"
                            )
                          }
                          className="bg-gray-800 text-white p-2 rounded"
                        >
                          <option value="user">Kullanıcı</option>
                          <option value="admin">Yönetici</option>
                        </select>
                      </td>
                      <td className="p-3">
                        {user.id !== session?.user?.id && (
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                          >
                            Sil
                          </button>
                        )}
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
