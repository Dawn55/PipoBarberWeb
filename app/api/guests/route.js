import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { redirect } from 'next/navigation';

export async function GET() {
  //   const session = await getServerSession(authOptions);

  //   if (!session || !session.user.isAdmin) {
  //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  //   }

  try {
    const users = await prisma.user.findMany({
      where: {
        isGuest: true,
      },
      select: {
        id: true,
        name: true,
        surname: true,
        phoneNumber: true,
        createdAt: true,
        isGuest: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching guest users:", error);
    return NextResponse.json(
      { error: "Failed to fetch guest users" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { name, surname, phoneNumber, description, date, time } = await request.json();

    
    if (!name || !surname || !phoneNumber || !description || !date || !time) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    
    const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');

    
    const guestUser = await prisma.$transaction(async (tx) => {
      let user = await tx.user.findFirst({
        where: { phoneNumber: cleanedPhoneNumber }
      });

      if (!user) {
        try {
        const guestEmail = `guest-${cleanedPhoneNumber}@yourdomain.com`;
          user = await tx.user.create({
            data: {
              name,
              surname,
              phoneNumber: cleanedPhoneNumber,
              isGuest: true,
              email: guestEmail,
            }
          });
        } catch (createError) {
          // Diğer transaction'ların tamamlanmasını bekleyip tekrar dene
          user = await tx.user.findFirst({
            where: { phoneNumber: cleanedPhoneNumber }
          });
          if (!user) throw createError;
        }
      }

      
      return await tx.user.update({
        where: { id: user.id },
        data: { name, surname, isGuest: true }
      });
    });

    
    const token = crypto.randomUUID();
    const appointmentDate = new Date(date);
    const [hours, minutes] = time.split(":");
    const appointmentTime = new Date(appointmentDate);
    appointmentTime.setHours(Number(hours));
    appointmentTime.setMinutes(Number(minutes));

    const appointment = await prisma.appointment.create({
      data: {
        userId: guestUser.id,
        description,
        date: appointmentDate,
        time: appointmentTime,
        token,
      },
    });

    return NextResponse.json({
      success: true,
      token,
      redirectUrl: `/guest/appointment/${token}`
    }, { status: 200 });

  } catch (error) {
    console.error("Hata:", error);
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { message: "Bu telefon numarası zaten kayıtlı", error: error.meta },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { message: error.message || "Sunucu hatası" },
      { status: 500 }
    );
  }
}
