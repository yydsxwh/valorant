import { setSessionCookie, verifyPassword } from "@/lib/auth";
import { getUserById, getUserRecord } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.json();
  const username = String(body.username || "").trim();
  const password = String(body.password || "");
  if (!username || !password) {
    return Response.json({ error: "请填写用户名和密码" }, { status: 400 });
  }
  const row = getUserRecord(username);
  if (!row || !verifyPassword(password, row.password_hash)) {
    return Response.json({ error: "用户名或密码不对" }, { status: 401 });
  }
  await setSessionCookie(row.id);
  return Response.json({ user: getUserById(row.id) });
}
