import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ error: "Yetkisiz erişim" }), {
      status: 401
    });
  }

  return new Response(JSON.stringify({ 
    message: "Gizli bilgi",
    user: session.user 
  }), {
    status: 200
  });
}