"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GuestAppointmentForm() {
  const [form, setForm] = useState({
    name: "",
    surname: "",
    phoneNumber: "",
    description: "",
    date: "",
    time: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  // Tarih validasyonları için
  const today = new Date().toISOString().split("T")[0];
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 1);
  const maxDateString = maxDate.toISOString().split("T")[0];

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Telefon numarası validasyonu
    if (name === "phoneNumber") {
      // Sadece sayıları kabul et ve maksimum 10 karakter
      const numbersOnly = value.replace(/\D/g, "").slice(0, 10);
      setForm({ ...form, [name]: numbersOnly });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    // Telefon numarasını formatla (başına 0 ekle)
    const formattedPhone = form.phoneNumber.length === 10 ? `0${form.phoneNumber}` : form.phoneNumber;

    try {
      // Tarih ve saat validasyonu
      const dateObj = new Date(`${form.date}T${form.time}`);
      if (isNaN(dateObj.getTime())) {
        throw new Error("Geçersiz tarih veya saat");
      }

      // Telefon numarası validasyonu
      if (form.phoneNumber.length !== 10) {
        throw new Error("Telefon numarası 10 haneli olmalıdır");
      }

      const res = await fetch("/api/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          phoneNumber: formattedPhone
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Randevu oluşturulamadı");
      }

      const data = await res.json();
      setSuccess("Randevu başarıyla oluşturuldu!");
      
      // 1.5 saniye sonra yönlendir
      setTimeout(() => {
        router.push(`/guest/appointment/${data.token}`);
      }, 1500);

    } catch (err) {
      setError(err.message || "Randevu oluşturulurken bir hata oluştu");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-white mb-6">Misafir Randevu Formu</h2>
      
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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Ad</label>
            <input
              name="name"
              placeholder="Adınız"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
              required
              minLength={2}
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Soyad</label>
            <input
              name="surname"
              placeholder="Soyadınız"
              value={form.surname}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
              required
              minLength={2}
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Telefon</label>
            <input
              name="phoneNumber"
              placeholder="5555555555 (10 haneli)"
              value={form.phoneNumber}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
              required
              pattern="\d{10}"
              title="10 haneli telefon numarası giriniz (örn: 5555555555)"
            />
            <p className="text-gray-400 text-xs mt-1">Başına 0 eklemenize gerek yok</p>
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Tarih</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
              required
              min={today}
              max={maxDateString}
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Saat</label>
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
              required
              min="09:00"
              max="19:00"
              step="1800" 
            />
            <p className="text-gray-400 text-xs mt-1">Çalışma saatleri: 09:00 - 19:00</p>
          </div>
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">Açıklama</label>
          <textarea
            name="description"
            placeholder="Randevu nedeni veya özel notlar"
            value={form.description}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
            rows="4"
            required
            minLength={4}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition duration-200 disabled:opacity-50"
        >
          {submitting ? "Oluşturuluyor..." : "Randevu Oluştur"}
        </button>
      </form>
    </div>
  );
}