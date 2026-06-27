"use client";

import { Home } from "lucide-react";
import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EditDriverVehicleForm from "@/components/forms/driver/edit-driver-vehicle-form";

const ProfileVehicleSettingsPage = () => {
  return (
    <>
      <Breadcrumbs>
        <BreadcrumbItem>
          <Home className="h-4 w-4" />
        </BreadcrumbItem>
        <BreadcrumbItem>Profile</BreadcrumbItem>
        <BreadcrumbItem>Vehicle Information</BreadcrumbItem>
      </Breadcrumbs>

      <Card className="mt-6">
        <CardHeader className="border-none pb-0">
          <CardTitle className="text-xl font-semibold text-default-900">Vehicle Information</CardTitle>
          <p className="text-sm text-default-500">
            Update your vehicle details, license plate, shift, and availability hours.
          </p>
        </CardHeader>
        <CardContent className="pt-6">
          <EditDriverVehicleForm />
        </CardContent>
      </Card>
    </>
  );
};

export default ProfileVehicleSettingsPage;
