import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";

export async function GET(req, { params }) {
  const { token } = params;

  try {
    const appointment = await prisma.appointment.findFirst({
      where: { token },
      include: {
        user: {
          select: { name: true, surname: true },
        },
        messages: {
          include: {
            sender: {
              select: { name: true, surname: true,isAdmin:true },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    return NextResponse.json(appointment);
  } catch (error) {
    console.error("Error fetching appointment by token:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
