"use client";

import { Home } from "lucide-react";
import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EditDriverDocumentsForm from "@/components/forms/driver/edit-driver-documents-form";

const ProfileDocumentsSettingsPage = () => {
  return (
    <>
      <Breadcrumbs>
        <BreadcrumbItem>
          <Home className="h-4 w-4" />
        </BreadcrumbItem>
        <BreadcrumbItem>Profile</BreadcrumbItem>
        <BreadcrumbItem>License & Documents</BreadcrumbItem>
      </Breadcrumbs>

      <Card className="mt-6">
        <CardHeader className="border-none pb-0">
          <CardTitle className="text-xl font-semibold text-default-900">License & Documents</CardTitle>
          <p className="text-sm text-default-500">
            Upload and update your driver license, permits, vehicle photos, and insurance documents.
          </p>
        </CardHeader>
        <CardContent className="pt-6">
          <EditDriverDocumentsForm />
        </CardContent>
      </Card>
    </>
  );
};

export default ProfileDocumentsSettingsPage;
