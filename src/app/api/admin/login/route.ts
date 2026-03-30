import { NextRequest, NextResponse } from "next/server";
import { createHash, randomBytes } from "crypto";

// ----------------------------------------------------------------
// penetration-tester: in-memory rate limiter
// In production replace with Redis (Upstash) for multi-instance safety.
// Structure: Map<ip, { attempts: number; resetAt: number }>
// ----------------------------------------------------------------
const rateLimitMap = new Map<string, { attempts: number; resetAt: number }>();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const LOCKOUT_MS = 60 * 60 * 1000; // 1 hour after max attempts

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

function checkRateLimit(ip: string): {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
} {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { attempts: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_ATTEMPTS - 1, retryAfterMs: 0 };
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterMs: record.resetAt - now,
    };
  }

  record.attempts += 1;
  return {
    allowed: true,
    remaining: MAX_ATTEMPTS - record.attempts,
    retryAfterMs: 0,
  };
}

// ----------------------------------------------------------------
// penetration-tester: generate a cryptographically random session
// token instead of the static "authenticated" string. The token
// is stored server-side in the Map and verified on each request.
// ----------------------------------------------------------------
export const activeTokens = new Map<string, { expiresAt: number }>();

export function verifySessionToken(req: NextRequest): boolean {
  const token = req.cookies.get("admin_session")?.value;
  if (!token) return false;
  
  const record = activeTokens.get(token);
  if (!record) return false;
  
  if (Date.now() > record.expiresAt) {
    activeTokens.delete(token);
    return false;
  }
  
  return true;
}

export async function GET(req: NextRequest) {
  const isValid = verifySessionToken(req);
  return NextResponse.json({ authenticated: isValid });
}

function generateSessionToken(): string {
  return randomBytes(32).toString("hex");
}

function hashPin(pin: string): string {
  return createHash("sha256").update(pin).digest("hex");
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rateCheck = checkRateLimit(ip);

  if (!rateCheck.allowed) {
    return NextResponse.json(
      {
        error: "Troppi tentativi. Riprova più tardi.",
        retryAfterMs: rateCheck.retryAfterMs,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil(rateCheck.retryAfterMs / 1000)),
        },
      }
    );
  }

  let body: { pin?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Richiesta non valida" }, { status: 400 });
  }

  const pin = typeof body.pin === "string" ? body.pin : "";

  // Constant-time comparison via hashing both sides
  const expectedHash = hashPin(process.env.ADMIN_PIN ?? "");
  const receivedHash = hashPin(pin);

  if (receivedHash !== expectedHash || !process.env.ADMIN_PIN) {
    // Slow down failed attempts to mitigate timing attacks
    await new Promise((r) => setTimeout(r, 300 + Math.random() * 200));
    return NextResponse.json({ error: "PIN errato" }, { status: 401 });
  }

  // ✅ Auth success — issue random token
  const token = generateSessionToken();
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24h
  activeTokens.set(token, { expiresAt });

  // Clean up expired tokens (simple GC)
  for (const [t, v] of activeTokens) {
    if (Date.now() > v.expiresAt) activeTokens.delete(t);
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24,
    path: "/",
  });

  return response;
}
