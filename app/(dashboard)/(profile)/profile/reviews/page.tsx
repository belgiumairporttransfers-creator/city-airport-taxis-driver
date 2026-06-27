"use client";

import LayoutLoader from "@/components/layout-loader";
import DriverReviews from "@/components/driver-profile/driver-reviews";
import { useDriverApplication } from "@/hooks/queries/use-driver";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const ProfileReviewsPage = () => {
  const { data, isLoading, isError } = useDriverApplication();

  if (isLoading) {
    return <LayoutLoader />;
  }

  if (isError || !data) {
    return (
      <Card>
        <CardContent className="flex flex-col items-start gap-4 p-6">
          <p className="text-default-700">No driver reviews are available yet.</p>
          <Button asChild variant="outline">
            <Link href="/profile">Back to Overview</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return <DriverReviews reviews={data.reviews ?? []} />;
};

export default ProfileReviewsPage;
