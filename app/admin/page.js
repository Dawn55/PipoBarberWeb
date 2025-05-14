"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AdminAppointmentList from "@/components/adminPanel/AdminAppointmentList";
import AdminAppointmentDetails from "@/components/adminPanel/AdminAppointmentDetails";
import AdminUserList from "@/components/adminPanel/AdminUserList";

export default function AdminPanel() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("appointments");
  const [appointments, setAppointments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    if (status === "loading") return;

    if (!session || !session.user.isAdmin) {
      router.push("/login");
      return;
    }

    fetchData();
  }, [session, status, router, activeTab]);

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

  const handleSendMessage = async (messageText) => {
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
      
      // Admin badge sorunu için: mesaj gönderildiğinde isAdmin bilgisini session'dan alıyoruz
      const messageWithCorrectAdminStatus = {
        ...newMessage,
        sender: {
          ...newMessage.sender,
          isAdmin: session?.user?.isAdmin || false
        }
      };

      setAppointments(
        appointments.map((apt) =>
          apt.id === selectedAppointment.id
            ? { 
                ...apt, 
                messages: [...apt.messages, messageWithCorrectAdminStatus] 
              }
            : apt
        )
      );

      setSelectedAppointment({
        ...selectedAppointment,
        messages: [...selectedAppointment.messages, messageWithCorrectAdminStatus],
      });

      return true;
    } catch (err) {
      setError(err.message);
      return false;
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
          <AdminAppointmentList 
            appointments={appointments}
            selectedAppointment={selectedAppointment}
            setSelectedAppointment={setSelectedAppointment}
          />

          <div className="md:col-span-2">
            {selectedAppointment ? (
              <AdminAppointmentDetails
                appointment={selectedAppointment}
                onDeleteAppointment={handleDeleteAppointment}
                onStatusChange={handleStatusChange}
                onSendMessage={handleSendMessage}
                currentUser={session?.user}
              />
            ) : (
              <div className="bg-gray-900 rounded-lg p-4 flex items-center justify-center h-full text-gray-400">
                <p>Detayları görmek için bir randevu seçin</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "users" && (
        <AdminUserList 
          users={users} 
          currentUserId={session?.user?.id}
          onRoleChange={handleRoleChange}
          onDeleteUser={handleDeleteUser}
        />
      )}
    </div>
  );
}