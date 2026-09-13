import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { getUserById } from "./db";
import type { PublicUser } from "./types";

export { hashPassword, verifyPassword } from "./password";

const SESSION_COOKIE = "valspot_session";
const SECRET = process.env.VALSPOT_SECRET || "valspot-dev-secret-change-me";

function sign(payload: string) {
  return createHmac("sha256", SECRET).update(payload).digest("hex");
}

export function createSessionToken(userId: string) {
  const exp = Date.now() + 1000 * 60 * 60 * 24 * 30;
  const payload = `${userId}.${exp}`;
  return `${payload}.${sign(payload)}`;
}

export function readSessionToken(token: string | undefined | null) {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [userId, exp, mac] = parts;
  const payload = `${userId}.${exp}`;
  const expected = sign(payload);
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  if (Number(exp) < Date.now()) return null;
  return userId;
}

export async function setSessionCookie(userId: string) {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, createSessionToken(userId), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

export async function getCurrentUser(): Promise<PublicUser | null> {
  const jar = await cookies();
  const userId = readSessionToken(jar.get(SESSION_COOKIE)?.value);
  if (!userId) return null;
  return getUserById(userId);
}
