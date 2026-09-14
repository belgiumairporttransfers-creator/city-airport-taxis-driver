import React, { Suspense } from "react";
import { getSeoMeta } from "@/lib/get-seo-meta";
import LayoutLoader from "@/components/layout-loader";
import DriverAcceptedBookingsPageView from "./page-view";

export const metadata = getSeoMeta({
  title: "All Bookings",
  description: "View all bookings you have accepted or completed.",
});

const DriverBookingsPage = () => {
  return (
    <Suspense fallback={<LayoutLoader />}>
      <DriverAcceptedBookingsPageView />
    </Suspense>
  );
};

export default DriverBookingsPage;
