import { Suspense } from "react";
import CreatePasswordForm from "@/components/forms/auth/create-password-form";
import LayoutLoader from "@/components/layout-loader";
import { getSeoMeta } from "@/lib/get-seo-meta";

export const metadata = getSeoMeta({
  title: "Set Password",
  description:
    "Set your password for the City Airport Taxis driver portal after your application is approved.",
});

export default function SetPasswordPage() {
  return (
    <Suspense fallback={<LayoutLoader />}>
      <CreatePasswordForm />
    </Suspense>
  );
}
