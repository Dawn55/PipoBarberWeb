// app/api/appointments/[id]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions, getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
  //   const session = await getSession(authOptions);

  //   if (!session || !session.user.isAdmin) {
  //     return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
  //   }

  try {
    const appointmentId = parseInt(params.id);

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            surname: true,
            email: true,
            phoneNumber: true,
          },
        },
        messages: {
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                surname: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "Randevu bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json(appointment);
  } catch (error) {
    console.error("Randevu detayı alınırken hata:", error);
    return NextResponse.json(
      { error: "Randevu detayları alınamadı" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const session = await getSession(authOptions);

  if (!session || !session.user.isAdmin) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const appointmentId = parseInt(params.id);
    const body = await request.json();

    // Sadece belirli alanların güncellenmesine izin ver
    const { status, date, time, description } = body;
    const updateData = {};

    if (status !== undefined) {
      updateData.status = parseInt(status);
    }
    if (date) {
      updateData.date = new Date(date);
    }
    if (time) {
      updateData.time = new Date(time);
    }
    if (description) {
      updateData.description = description;
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            surname: true,
          },
        },
      },
    });

    return NextResponse.json(updatedAppointment);
  } catch (error) {
    console.error("Randevu güncellenirken hata:", error);
    return NextResponse.json(
      { error: "Randevu güncellenemedi" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const session = await getSession(authOptions);

  if (!session || !session.user.isAdmin) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const appointmentId = parseInt(params.id);

    await prisma.appointmentMessage.deleteMany({
      where: { appointmentId },
    });

    await prisma.appointment.delete({
      where: { id: appointmentId },
    });

    return NextResponse.json(
      { message: "Randevu başarıyla silindi" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Randevu silinirken hata:", error);
    return NextResponse.json({ error: "Randevu silinemedi" }, { status: 500 });
  }
}
