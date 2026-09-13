import { notFound } from "next/navigation";
import { ProfileView } from "@/components/ProfileView";
import { getCurrentUser } from "@/lib/auth";
import { getUserById, listFavorites, listPosts } from "@/lib/db";

export default async function UserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = getUserById(id);
  if (!profile) notFound();
  const me = await getCurrentUser();
  const { posts } = listPosts({ authorId: profile.id, limit: 40 }, me?.id);
  const favorites = me?.id === profile.id ? listFavorites(profile.id) : [];
  return <ProfileView user={profile} posts={posts} favorites={favorites} mine={me?.id === profile.id} />;
}
