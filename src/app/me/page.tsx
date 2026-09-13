import { redirect } from "next/navigation";
import { ProfileView } from "@/components/ProfileView";
import { getCurrentUser } from "@/lib/auth";
import { listFavorites, listPosts } from "@/lib/db";

export default async function MePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/me");
  const { posts } = listPosts({ authorId: user.id, limit: 40 }, user.id);
  const favorites = listFavorites(user.id);
  return <ProfileView user={user} posts={posts} favorites={favorites} mine />;
}
