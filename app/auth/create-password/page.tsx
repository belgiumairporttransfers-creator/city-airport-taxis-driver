import { redirect } from "next/navigation";

export default async function CreatePasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; email?: string }>;
}) {
  const params = await searchParams;
  const query = new URLSearchParams();

  if (params.token) {
    query.set("token", params.token);
  }

  if (params.email) {
    query.set("email", params.email);
  }

  const queryString = query.toString();

  redirect(`/auth/set-password${queryString ? `?${queryString}` : ""}`);
}
