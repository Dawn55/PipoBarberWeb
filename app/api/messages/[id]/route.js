import { authOptions } from "@/lib/auth";
import prisma from '@/lib/prisma';
import { getSession } from "@/lib/auth";

export async function DELETE(req, { params }) {
  try {
    const session = await getSession(authOptions);
    
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    const messageId = parseInt(params.id);
    if (isNaN(messageId)) {
      return new Response(JSON.stringify({ error: "Invalid message ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    
    const message = await prisma.message.findUnique({
      where: { id: messageId },
    });
    
    if (!message) {
      return new Response(JSON.stringify({ error: "Message not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    
    if (!session.user.isAdmin && message.sender_id !== session.user.id) {
      return new Response(JSON.stringify({ error: "Permission denied" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    
    await prisma.message.delete({
      where: { id: messageId },
    });
    
    return new Response(JSON.stringify({ message: "Message deleted successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to delete message:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}