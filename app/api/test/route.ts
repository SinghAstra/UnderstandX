import { Octokit } from "@octokit/rest";
import { NextResponse } from "next/server";

const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN,
});

export async function GET() {
  try {
    // const owner = "singhastra";
    // const repo = "layoutx";
    // const path = "";
    // const { data: contents } = await octokit.repos.getContent({
    //   owner,
    //   repo,
    //   path,
    // });

    const path = "components";
    const res1 = path.split("/").slice(0, -1);
    const res2 = path.split("/").slice(0, -1).join("/");

    return NextResponse.json({ res1, res2 });
  } catch (error) {
    console.log("Error Occurred in  --/api/test");
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }

    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}
