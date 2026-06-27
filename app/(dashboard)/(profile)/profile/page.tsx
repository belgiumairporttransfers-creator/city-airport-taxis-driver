"use client";

import LayoutLoader from "@/components/layout-loader";
import About from "@/components/driver-profile/about";
import ApplicationStatusAlert from "@/components/driver-profile/application-status-alert";
import ProfileProgress from "@/components/driver-profile/profile-progress";
import Skills from "@/components/driver-profile/skills";
import UserInfo from "@/components/driver-profile/user-info";
import VehicleInfo from "@/components/driver-profile/vehicle-info";
import { useDriverApplication } from "@/hooks/queries/use-driver";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const ProfileOverviewPage = () => {
  const { data, isLoading, isError } = useDriverApplication();

  if (isLoading) {
    return <LayoutLoader />;
  }

  if (isError || !data) {
    return (
      <Card>
        <CardContent className="flex flex-col items-start gap-4 p-6">
          <p className="text-default-700">
            No driver application was found for your account. You can still manage your login
            details from account settings.
          </p>
          <Button asChild>
            <Link href="/profile/settings">Edit Personal Details</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <ApplicationStatusAlert driver={data} />
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 space-y-6 lg:col-span-4">
          <ProfileProgress driver={data} />
          <UserInfo driver={data} />
          <Skills skills={data.skills ?? []} />
        </div>
        <div className="col-span-12 min-w-0 space-y-6 lg:col-span-8">
          <About about={data.about ?? ""} />
          <VehicleInfo driver={data} />
        </div>
      </div>
    </div>
  );
};

export default ProfileOverviewPage;
