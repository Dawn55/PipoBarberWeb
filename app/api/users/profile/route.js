import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import  prisma  from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function PUT(req) {
  try {
    const session = await getSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: 'Oturum açmanız gerekiyor' },
        { status: 401 }
      );
    }

    const data = await req.json();
    const { name, surname, phoneNumber, email } = data;

    // Basit validasyon
    if (!name || !surname || !phoneNumber || !email) {
      return NextResponse.json(
        { message: 'Tüm alanlar doldurulmalıdır' },
        { status: 400 }
      );
    }

    if (phoneNumber.length !== 11 || !/^\d+$/.test(phoneNumber)) {
      return NextResponse.json(
        { message: 'Geçerli bir telefon numarası giriniz (11 haneli ve sadece rakam)' },
        { status: 400 }
      );
    }

    
    if (email !== session.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (existingUser) {
        return NextResponse.json(
          { message: 'Bu e-posta adresi zaten kullanılıyor' },
          { status: 400 }
        );
      }
    }

    
    const updatedUser = await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        name,
        surname,
        phoneNumber,
        email,
      },
      select: {
        id: true,
        name: true,
        surname: true,
        phoneNumber: true,
        email: true,
        isAdmin: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Profil güncelleme hatası:', error);
    return NextResponse.json(
      { message: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}