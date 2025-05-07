import { authOptions } from "@/lib/auth-options";
import { getServerSession } from "next-auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const EXPRESS_API_URL = process.env.EXPRESS_API_URl;
    if (!EXPRESS_API_URL) {
      throw new Error("EXPRESS_API_URL is required.");
    }

    const response = await fetch(EXPRESS_API_URL);
    const data = await response.json();

    return Response.json({ message: "Activated Backend Server", data });
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error message:", error.message);
      console.log("Error stack:", error.stack);
    }

    return Response.json(
      { message: "Failed to activate backend." },
      { status: 500 }
    );
  }
}
