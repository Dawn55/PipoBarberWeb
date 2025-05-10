"use client";

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
        setError("Invalid email or password");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="flex w-full max-w-5xl rounded-lg shadow-lg overflow-hidden">
        <div className="hidden md:block w-1/2 bg-gray-900">
          {/* Image area: 600x800 pixels recommended */}
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-white p-6">
              <h2 className="text-3xl font-bold mb-4">Premium Barbershop</h2>
              <p className="text-gray-300">Experience the finest grooming services</p>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 bg-gray-800 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
            <p className="text-gray-400 mt-2">Sign in to your account</p>
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
                className="w-full px-4 py-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-gray-500"
                placeholder="Your email"
              />
            </div>

            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <label
                  htmlFor="password"
                  className="text-gray-300 text-sm font-medium"
                >
                  Password
                </label>
                <a
                  href="#"
                  className="text-sm text-gray-400 hover:text-white"
                >
                  Forgot password?
                </a>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-gray-500"
                placeholder="Your password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-900 hover:bg-gray-700 text-white font-medium py-3 rounded-md transition duration-300 border border-gray-600"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-white hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}