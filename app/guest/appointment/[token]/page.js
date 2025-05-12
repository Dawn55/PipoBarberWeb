import { notFound } from "next/navigation";
import GuestAppointmentDetail from "@/components/appointments/GuestAppointmentDetail";

export default async function GuestAppointmentPage({ params }) {
  const appointment = await getAppointmentByToken(params.token);

  if (!appointment) return notFound();

  async function getAppointmentByToken(token) {
    const res = await fetch(
      `http://localhost:3000/api/guests/appointment/${token}`,
      {
        cache: "no-store",
      }
    );
    
    if (!res.ok) return null;
    const data = await res.json();
    
    // Ensure messages array exists
    if (!data.messages) {
      data.messages = [];
    }
    
    return data;
  }

  return (
    <div className="max-w-3xl mx-auto py-10">
      <GuestAppointmentDetail appointment={appointment} />
    </div>
  );
}