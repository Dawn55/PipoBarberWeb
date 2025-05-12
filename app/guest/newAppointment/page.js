import GuestAppointmentForm from '@/components/appointments/GuestAppointmentForm'
import React from 'react'

export default function newAppointment() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Kayıt Olmadan Randevu Alın</h1>
          <p className="text-gray-300">Lütfen randevu bilgilerinizi giriniz</p>
        </div>
        <GuestAppointmentForm />
      </div>
    </div>
  )
}
