import { NextResponse } from "next/server";
import { getInterestStatus, toggleInterestStatus } from "@/lib/server/interested";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// Handle GET requests
export async function GET(req) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");
  const email = session.user.email;

  if (!projectId || !email) {
    return NextResponse.json({ error: "Project ID and user email are required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const isInterested = await getInterestStatus(user.id, projectId);
  return NextResponse.json({ interested: isInterested });
}

// Handle POST requests
export async function POST(req) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId, isInterested } = await req.json();
  const email = session.user.email;

  if (!projectId || typeof isInterested !== "boolean" || !email) {
    return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  await toggleInterestStatus(user.id, projectId, isInterested);
  return NextResponse.json({ success: true });
}
