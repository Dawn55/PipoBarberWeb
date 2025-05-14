'use client';

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result.error) {
        setError("Geçersiz email veya şifre");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex w-full max-w-5xl rounded-lg shadow-lg overflow-hidden">
        <div className="hidden md:block w-1/2 bg-gray-800">
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-white p-6">
              <h2 className="text-3xl font-bold mb-4">Premium Berber</h2>
              <p className="text-gray-300">Profesyonel tıraş ve bakım hizmetleri</p>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 bg-gray-800 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white">Hoş Geldiniz</h1>
            <p className="text-gray-400 mt-2">Hesabınıza giriş yapın</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500 text-white rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-gray-300 text-sm font-medium mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-accent"
                placeholder="Email adresiniz"
              />
            </div>

            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <label
                  htmlFor="password"
                  className="text-gray-300 text-sm font-medium"
                >
                  Şifre
                </label>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-accent"
                placeholder="Şifreniz"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-accent hover:bg-accent-dark text-black font-medium py-3 rounded-md transition duration-300 disabled:opacity-50"
            >
              {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Hesabınız yok mu?{" "}
              <Link href="/register" className="text-accent hover:underline">
                Kayıt olun
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}