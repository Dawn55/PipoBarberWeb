import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions, getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request, { params }) {
  try {
    const appointmentId = parseInt(params.id);
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: "Message text is required" },
        { status: 400 }
      );
    }

    const session = await getSession(authOptions);

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { user: true },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    let senderId;

    // Eğer giriş yapılmışsa ve admin değilse, sadece kendi randevusuna mesaj atabilir
    if (session) {
      console.log("pasa" ,session)
      if (
        !session.user.isAdmin &&
        appointment.userId !== session.user.id
      ) {
        return NextResponse.json(
          { error: "You can only message your own appointment" },
          { status: 403 }
        );
      }
      senderId = session.user.id;
    } else {
      // Giriş yapılmamışsa, sadece guest kullanıcılar mesaj gönderebilir
      if (!appointment.user.isGuest) {
        return NextResponse.json(
          { error: "Unauthorized access" },
          { status: 403 }
        );
      }
      senderId = appointment.userId;
    }

    const message = await prisma.appointmentMessage.create({
      data: {
        appointmentId,
        senderId,
        text,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            surname: true,
          },
        },
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("Error adding message:", error);
    return NextResponse.json(
      { error: "Failed to add message" },
      { status: 500 }
    );
  }
}
