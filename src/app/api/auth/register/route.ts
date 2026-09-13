import { setSessionCookie } from "@/lib/auth";
import { createUser, getUserRecord } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.json();
  const username = String(body.username || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const displayName = String(body.displayName || "").trim();
  if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]{2,16}$/.test(username)) {
    return Response.json({ error: "用户名用 2-16 个字母、数字或中文" }, { status: 400 });
  }
  if (!email.includes("@")) {
    return Response.json({ error: "邮箱格式不对" }, { status: 400 });
  }
  if (password.length < 6) {
    return Response.json({ error: "密码至少 6 位" }, { status: 400 });
  }
  if (getUserRecord(username) || getUserRecord(email)) {
    return Response.json({ error: "用户名或邮箱已被占用" }, { status: 409 });
  }
  const user = createUser({ username, email, password, displayName });
  await setSessionCookie(user.id);
  return Response.json({ user });
}
