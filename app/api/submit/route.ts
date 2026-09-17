import { NextResponse } from "next/server";
import { writeFile, mkdir, readFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

// NOTE: this writes to the local filesystem, which is fine for local dev
// and for demoing on your own machine, but Vercel's serverless filesystem
// is read-only in production. For a real deployment, swap this for
// Supabase/Firebase/a real database — see the README.
const DATA_DIR = join(process.cwd(), "mock-data");
const FILE_PATH = join(DATA_DIR, "registrations.json");

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!existsSync(DATA_DIR)) {
      await mkdir(DATA_DIR);
    }

    let registrations = [];
    if (existsSync(FILE_PATH)) {
      const content = await readFile(FILE_PATH, "utf-8");
      registrations = JSON.parse(content || "[]");
    }

    registrations.push({ ...data, submittedAt: new Date().toISOString() });
    await writeFile(FILE_PATH, JSON.stringify(registrations, null, 2), "utf-8");

    return NextResponse.json({ message: "Success", saved: true });
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json(
      { message: "Failed to save registration" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    if (!existsSync(FILE_PATH)) {
      return NextResponse.json([]);
    }
    const content = await readFile(FILE_PATH, "utf-8");
    return NextResponse.json(JSON.parse(content || "[]"));
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { message: "Error reading registrations" },
      { status: 500 }
    );
  }
}
