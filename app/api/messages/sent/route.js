import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(req) {
  try {
    const session = await getSession(authOptions);
    
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const userId = session.user.id;
    
    const messages = await prisma.message.findMany({
      where: {
        sender_id: userId,
      },
      include: {
        receiver: {
          select: {
            id: true,
            name: true,
            surname: true,
            isAdmin: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return new Response(JSON.stringify(messages), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to fetch sent messages:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}