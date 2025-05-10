import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
              phoneNumber: true
            }
          },
          messages: {
            include: {
              sender: {
                select: {
                  id: true,
                  name: true,
                  surname: true
                }
              }
            },
            orderBy: {
              createdAt: 'asc'
            }
          }
        },
        orderBy: {
          date: 'asc'
        }
      });
    } else {
      appointments = await prisma.appointment.findMany({
        where: {
          userId: session.user.id
        },
        include: {
          messages: {
            include: {
              sender: {
                select: {
                  id: true,
                  name: true,
                  surname: true
                }
              }
            },
            orderBy: {
              createdAt: 'asc'
            }
          }
        },
        orderBy: {
          date: 'asc'
        }
      });
    }
    
    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  console.log(session)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { description, date, time,userId } = await request.json();

    if (!description || !date || !time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const appointmentDate = new Date(date);

    const [hours, minutes] = time.split(':');
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
      }
    });

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
  }
}
