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
      setError("You must be logged in to create an appointment");
      return;
    }
    
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // Format the date and time for the API
      const dateObj = new Date(`${formData.date}T${formData.time}`);
      
      if (isNaN(dateObj.getTime())) {
        throw new Error("Invalid date or time");
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
      }
    );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create appointment");
      }

      setSuccess("Appointment created successfully!");
      setFormData({
        description: "",
        date: "",
        time: "",
      });
      
      // Refresh the page after successful creation
      setTimeout(() => {
        router.refresh();
      }, 1500);
      
    } catch (error) {
      setError(error.message || "An error occurred while creating the appointment");
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate min date (today)
  const today = new Date().toISOString().split("T")[0];
  
  // Calculate max date (3 months from now)
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 1);
  const maxDateString = maxDate.toISOString().split("T")[0];

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-white mb-6">Book New Appointment</h2>
      
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
            Service Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-4 py-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-gray-500"
            placeholder="Describe the service you need (e.g., Haircut, Beard Trim, etc.)"
          />
        </div>
        
        <div className="mb-4">
          <label 
            htmlFor="date" 
            className="block text-gray-300 text-sm font-medium mb-2"
          >
            Date
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
            Time
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
            step="1800" // 30-minute intervals
            className="w-full px-4 py-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-gray-500"
          />
          <p className="text-gray-400 text-xs mt-1">
            Business hours: 9:00 AM - 7:00 PM
          </p>
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gray-900 hover:bg-gray-700 text-white font-medium py-3 rounded-md transition duration-300 border border-gray-600 disabled:opacity-50"
        >
          {isLoading ? "Creating Appointment..." : "Book Appointment"}
        </button>
      </form>
    </div>
  );
}