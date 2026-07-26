import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const filePath = path.join(process.cwd(), "revelations", name);

  if (!fs.existsSync(filePath)) {
    return new NextResponse("Scripture not found", { status: 404 });
  }

  const content = fs.readFileSync(filePath, "utf-8");
  return new NextResponse(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
