import { authOptions } from "@/lib/auth";
import prisma from '@/lib/prisma';
import { getSession } from "@/lib/auth";

export async function POST(req) {
  try {
    const session = await getSession(authOptions);
    
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    console.log(session.user.id)
    const userId = session.user.id;
    const { receiver_id, title, description } = await req.json();
    
    if (!receiver_id || !title || !description) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    console.log(prisma)

    const receiver = await prisma.user.findUnique({
      where: { id: parseInt(receiver_id) }
    });

    if (!receiver) {
      return new Response(JSON.stringify({ error: "Receiver not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const newMessage = await prisma.message.create({
      data: {
        sender_id: userId,
        receiver_id: parseInt(receiver_id),
        title,
        description,
      },
    });

    return new Response(JSON.stringify(newMessage), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to send message:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}