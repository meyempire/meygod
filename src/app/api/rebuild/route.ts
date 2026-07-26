import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));

  if (body.type === "journal_created") {
    const deployHook = process.env.VERCEL_DEPLOY_HOOK;
    if (deployHook) {
      await fetch(deployHook, { method: "POST" });
    }
  }

  return NextResponse.json({ ok: true });
}
