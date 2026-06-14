import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { issueOtp } from "@/lib/otp";
import { rateLimit } from "@/lib/rate-limit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: { email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  // 3 OTP requests per email per 15 minutes — prevents email flooding
  if (!rateLimit(`pwd-otp:${email}`, 3, 15 * 60 * 1000)) {
    return NextResponse.json({ error: "too_many_requests" }, { status: 429 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  // Always return 200 regardless of whether the email exists — returning 404
  // would let attackers enumerate which emails are registered.
  if (!user) {
    return NextResponse.json({ ok: true });
  }

  const { devCode } = await issueOtp(email);
  return NextResponse.json({ ok: true, devCode });
}
