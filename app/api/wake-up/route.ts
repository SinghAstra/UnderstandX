export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const EXPRESS_API_URL = process.env.EXPRESS_API_URL;
    const AWAKE_API_URL = process.env.AWAKE_API_URL;
    if (!EXPRESS_API_URL) {
      throw new Error("EXPRESS_API_URL is not defined");
    }
    if (!AWAKE_API_URL) {
      throw new Error("AWAKE_API_URL is not defined");
    }

    const response = await fetch(`${AWAKE_API_URL}/api/wake-up`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ apiURL: EXPRESS_API_URL }),
    });

    const data = await response.json();

    return Response.json({ isActive: true, data });
  } catch (error) {
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
    return Response.json({ message: "Failed to activate Server" });
  }
}
