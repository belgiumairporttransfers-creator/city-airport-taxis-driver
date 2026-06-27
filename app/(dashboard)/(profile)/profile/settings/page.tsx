"use client";

import { Home } from "lucide-react";
import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EditDriverProfileForm from "@/components/forms/driver/edit-driver-profile-form";

const ProfileSettingsPage = () => {
  return (
    <>
      <Breadcrumbs>
        <BreadcrumbItem>
          <Home className="h-4 w-4" />
        </BreadcrumbItem>
        <BreadcrumbItem>Profile</BreadcrumbItem>
        <BreadcrumbItem>Personal Details</BreadcrumbItem>
      </Breadcrumbs>

      <Card className="mt-6">
        <CardHeader className="border-none pb-0">
          <CardTitle className="text-xl font-semibold text-default-900">Personal Details</CardTitle>
          <p className="text-sm text-default-500">
            Update your personal information, profile photo, location, and skills.
          </p>
        </CardHeader>
        <CardContent className="pt-6">
          <EditDriverProfileForm />
        </CardContent>
      </Card>
    </>
  );
};

export default ProfileSettingsPage;
