"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const updatedProfile = searchParams.get("updated");

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    surname: "",
    phoneNumber: "",
    email: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    
    if (updatedProfile === "true") {
      setSuccess("Profil başarıyla güncellendi ve oturum yenilendi");
      setTimeout(() => setSuccess(""), 5000);
    }
    
    if (status === "authenticated" && session) {
      const fullName = session.user?.name || "";
      const [name, surname] = fullName.split(" ");
      setUserData({
        name: name || "",
        surname: surname || "",
        phoneNumber: session.user?.phone || "",
        email: session.user?.email || "",
      });
      setIsLoading(false);
    }
  }, [session, status, router, updatedProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const profileData = {
        name: userData.name,
        surname: userData.surname, 
        phoneNumber: userData.phoneNumber,
        email: userData.email,
      };

      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Profil güncellenemedi");
      }

      setSuccess("Profil başarıyla güncellendi. Değişikliklerin aktif olması için oturumunuzu yenilemeniz gerekiyor.");
      setShowLogoutConfirm(true);
      
    } catch (error) {
      setError(error?.error || "Profil güncellenirken bir hata oluştu");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
    setSuccess("");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl rounded-lg shadow-lg overflow-hidden bg-gray-800">
        <div className="px-6 py-6 border-b border-gray-700">
          <h1 className="text-3xl font-bold text-white">Profil Bilgilerim</h1>
          <p className="mt-1 text-gray-400">
            Kişisel bilgilerinizi görüntüleyebilir ve güncelleyebilirsiniz.
          </p>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-500 text-white rounded-md text-sm">
              {error}
            </div>
          )}
          
          {success && !showLogoutConfirm && (
            <div className="mb-4 p-3 bg-green-500 text-white rounded-md text-sm">
              {success}
            </div>
          )}

          {showLogoutConfirm && (
            <div className="mb-4 p-4 bg-gray-700 rounded-md">
              <p className="text-white mb-3">Profil bilgileriniz güncellendi. Değişikliklerin etkili olması için oturumunuzu yenilemeniz gerekiyor. Çıkış yapmak istiyor musunuz?</p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleCancelLogout}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
                >
                  Vazgeç
                </button>
                <button
                  onClick={handleConfirmLogout}
                  className="px-4 py-2 bg-accent text-black rounded hover:bg-accent-dark"
                >
                  Çıkış Yap
                </button>
              </div>
            </div>
          )}

          {!isEditing ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Ad</h3>
                  <p className="mt-1 text-lg font-medium text-white">
                    {userData.name}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-400">Soyad</h3>
                  <p className="mt-1 text-lg font-medium text-white">
                    {userData.surname}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-400">E-posta</h3>
                  <p className="mt-1 text-lg font-medium text-white">
                    {userData.email}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-400">
                    Telefon Numarası
                  </h3>
                  <p className="mt-1 text-lg font-medium text-white">
                    {userData.phoneNumber}
                  </p>
                </div>
              </div>

              <div className="pt-5 flex justify-end">
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="bg-gray-700 text-white py-2 px-4 rounded-md shadow-sm text-sm font-medium hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-accent"
                >
                  Ana Sayfa
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="ml-3 inline-flex justify-center py-2 px-4 rounded-md shadow-sm text-sm font-medium bg-accent hover:bg-accent-dark text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-accent"
                >
                  Düzenle
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Ad
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      value={userData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="surname"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Soyad
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="surname"
                      id="surname"
                      required
                      value={userData.surname}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-300"
                  >
                    E-posta
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      value={userData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Telefon Numarası
                  </label>
                  <div className="mt-1">
                    <input
                      type="tel"
                      name="phoneNumber"
                      id="phoneNumber"
                      required
                      value={userData.phoneNumber}
                      onChange={handleChange}
                      pattern="[0-9]{11}"
                      className="w-full px-4 py-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-accent"
                    />
                    <p className="mt-1 text-xs text-gray-400">
                      11 haneli telefon numaranızı başında 0 ile giriniz (örn:
                      05551234567)
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-5 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-700 text-white py-2 px-4 rounded-md shadow-sm text-sm font-medium hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-accent"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="ml-3 inline-flex justify-center py-2 px-4 rounded-md shadow-sm text-sm font-medium bg-accent hover:bg-accent-dark text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-accent"
                >
                  {isSubmitting ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}