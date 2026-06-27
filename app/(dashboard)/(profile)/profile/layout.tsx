"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/driver-profile/header";

const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isSettingsRoute = pathname.startsWith("/profile/settings");

  if (isSettingsRoute) {
    return <div className="relative z-10">{children}</div>;
  }

  return (
    <>
      <Header />
      <div className="relative z-10 pt-4">{children}</div>
    </>
  );
};

export default ProfileLayout;
