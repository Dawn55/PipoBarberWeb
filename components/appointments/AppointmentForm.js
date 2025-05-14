"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function AppointmentForm() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [formData, setFormData] = useState({
    description: "",
    date: "",
    time: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!session?.user?.id) {
      setError("Randevu oluşturmak için giriş yapmalısınız");
      return;
    }
    
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const dateObj = new Date(`${formData.date}T${formData.time}`);
      
      if (isNaN(dateObj.getTime())) {
        throw new Error("Geçersiz tarih veya saat");
      }
      
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: parseInt(session.user.id),
          description: formData.description,
          date: formData.date,
          time: formData.time,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        
        throw new Error(data.error || "Randevu oluşturulamadı");
      }

      setSuccess("Randevu başarıyla oluşturuldu!");
      setFormData({
        description: "",
        date: "",
        time: "",
      });
      
      setTimeout(() => {
        router.refresh();
      }, 1500);
      
    } catch (error) {
      setError(error.message || "Randevu oluşturulurken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 1);
  const maxDateString = maxDate.toISOString().split("T")[0];

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-white mb-6">Yeni Randevu Oluştur</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-500 text-white rounded-md text-sm">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-500 text-white rounded-md text-sm">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label 
            htmlFor="description" 
            className="block text-gray-300 text-sm font-medium mb-2"
          >
            Hizmet Açıklaması
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-4 py-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-gray-500"
            placeholder="İhtiyacınız olan hizmeti açıklayın (örn: Saç Kesimi, Sakal Düzeltme vb.)"
          />
        </div>
        
        <div className="mb-4">
          <label 
            htmlFor="date" 
            className="block text-gray-300 text-sm font-medium mb-2"
          >
            Tarih
          </label>
          <input
            id="date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            required
            min={today}
            max={maxDateString}
            className="w-full px-4 py-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-gray-500"
          />
        </div>
        
        <div className="mb-6">
          <label 
            htmlFor="time" 
            className="block text-gray-300 text-sm font-medium mb-2"
          >
            Saat
          </label>
          <input
            id="time"
            name="time"
            type="time"
            value={formData.time}
            onChange={handleChange}
            required
            min="09:00"
            max="19:00"
            step="1800"
            className="w-full px-4 py-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-gray-500"
          />
          <p className="text-gray-400 text-xs mt-1">
            Çalışma saatleri: 09:00 - 19:00
          </p>
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gray-900 hover:bg-gray-700 text-white font-medium py-3 rounded-md transition duration-300 border border-gray-600 disabled:opacity-50"
        >
          {isLoading ? "Randevu Oluşturuluyor..." : "Randevu Al"}
        </button>
      </form>
    </div>
  );
}