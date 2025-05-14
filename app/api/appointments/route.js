import { NextResponse } from "next/server";
import { authOptions, getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let appointments;

    if (session.user.isAdmin) {
      appointments = await prisma.appointment.findMany({
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
                  isAdmin: true,
                },
              },
            },
            orderBy: {
              createdAt: "asc",
            },
          },
        },
        orderBy: {
          date: "asc",
        },
      });
    } else {
      appointments = await prisma.appointment.findMany({
        where: {
          userId: Number(session.user.id),
        },
        include: {
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
        orderBy: {
          date: "asc",
        },
      });
    }
    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const session = await getSession(authOptions);
  console.log(session);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { description, date, time, userId } = await request.json();

    if (!description || !date || !time) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const appointmentDate = new Date(date);
    
    
    const [hours, minutes] = time.split(":");
    
    
    const existingAppointments = await prisma.appointment.findMany({
      where: {
        date: appointmentDate,
        status: {
          not: 2,
        },
      },
    });
    
    
    const timeExists = existingAppointments.some(app => {
      const appTime = new Date(app.time);
      return appTime.getHours() === Number(hours) && 
             appTime.getMinutes() === Number(minutes);
    });
    
    if (timeExists) {
      return NextResponse.json(
        {
          error: "Bu tarih ve saatte başka bir randevu bulunmaktadır. Lütfen başka bir zaman seçiniz.",
        },
        { status: 409 }
      );
    }

    const appointmentTime = new Date();
    appointmentTime.setHours(Number(hours));
    appointmentTime.setMinutes(Number(minutes));
    appointmentTime.setSeconds(0);
    appointmentTime.setMilliseconds(0);

    const appointment = await prisma.appointment.create({
      data: {
        userId: userId,
        description,
        date: appointmentDate,
        time: appointmentTime,
      },
    });

    return NextResponse.json(appointment);
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { error: "Failed to create appointment", details: error.message },
      { status: 500 }
    );
  }
}