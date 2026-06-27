import { redirect } from "next/navigation";
import { getSeoMeta } from "@/lib/get-seo-meta";

export const metadata = getSeoMeta({
  title: "Home",
  description:
    "City Airport Taxis driver portal. Sign in to access your dashboard, trips, and account settings.",
});

const Page = () => {
  redirect("/dashboard");
};

export default Page;
