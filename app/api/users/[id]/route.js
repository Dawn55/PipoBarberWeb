import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions, getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function PATCH(request, { params }) {
  const session = await getSession(authOptions);
  
  if (!session || !session.user.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const userId = parseInt(params.id);
    const { isAdmin } = await request.json();
    
    if (typeof isAdmin !== 'boolean') {
      return NextResponse.json({ error: 'isAdmin must be a boolean value' }, { status: 400 });
    }
    
    if (userId === session.user.id) {
      return NextResponse.json({ error: 'Cannot change your own role' }, { status: 403 });
    }
    
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isAdmin },
      select: {
        id: true,
        name: true,
        surname: true,
        email: true,
        phoneNumber: true,
        isAdmin: true
      }
    });
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
export async function DELETE(request, { params }) {
  const session = await getSession(authOptions);
  
  if (!session || !session.user.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const userId = parseInt(params.id);
    
    if (userId === session.user.id) {
      return NextResponse.json({ error: 'You cannot delete your own account' }, { status: 403 });
    }

    
    const result = await prisma.$transaction(async (prisma) => {
      
      await prisma.appointmentMessage.deleteMany({
        where: { senderId: userId }
      });

      
      const userAppointments = await prisma.appointment.findMany({
        where: { userId: userId },
        select: { id: true }
      });

      const appointmentIds = userAppointments.map(a => a.id);
      
      await prisma.appointmentMessage.deleteMany({
        where: { appointmentId: { in: appointmentIds } }
      });

      await prisma.appointment.deleteMany({
        where: { userId: userId }
      });

      
      const deletedUser = await prisma.user.delete({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          surname: true,
          email: true
        }
      });

      return deletedUser;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error deleting user:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}