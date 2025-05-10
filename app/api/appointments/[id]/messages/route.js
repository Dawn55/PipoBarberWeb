import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(request, { params }) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const appointmentId = parseInt(params.id);
    const { text } = await request.json();
    
    if (!text) {
      return NextResponse.json({ error: 'Message text is required' }, { status: 400 });
    }
    
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { user: true }
    });
    
    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }
    
    if (!session.user.isAdmin && appointment.userId !== session.user.id) {
      return NextResponse.json({ error: 'You can only add messages to your own appointments' }, { status: 403 });
    }
    
    const message = await prisma.appointmentMessage.create({
      data: {
        appointmentId,
        senderId: session.user.id,
        text
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            surname: true
          }
        }
      }
    });
    
    return NextResponse.json(message);
  } catch (error) {
    console.error('Error adding message:', error);
    return NextResponse.json({ error: 'Failed to add message' }, { status: 500 });
  }
}