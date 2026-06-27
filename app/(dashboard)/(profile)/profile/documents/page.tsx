"use client";

import LayoutLoader from "@/components/layout-loader";
import DriverDocuments from "@/components/driver-profile/driver-documents";
import { useDriverApplication } from "@/hooks/queries/use-driver";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const ProfileDocumentsPage = () => {
  const { data, isLoading, isError } = useDriverApplication();

  if (isLoading) {
    return <LayoutLoader />;
  }

  if (isError || !data) {
    return (
      <Card>
        <CardContent className="flex flex-col items-start gap-4 p-6">
          <p className="text-default-700">No driver application documents are available.</p>
          <Button asChild variant="outline">
            <Link href="/profile/settings">Edit Personal Details</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return <DriverDocuments driver={data} />;
};

export default ProfileDocumentsPage;
