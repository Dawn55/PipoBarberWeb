import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function PATCH(request, { params }) {
  const session = await getServerSession(authOptions);
  
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