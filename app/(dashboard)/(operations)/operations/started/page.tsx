import { Suspense } from "react";
import { getSeoMeta } from "@/lib/get-seo-meta";
import LayoutLoader from "@/components/layout-loader";
import DriverBookingsListPage from "@/components/bookings/driver-bookings-list-page";

export const metadata = getSeoMeta({
  title: "Started Trips",
  description: "View trips currently in progress.",
});

const Page = () => (
  <Suspense fallback={<LayoutLoader />}>
    <DriverBookingsListPage viewKey="started" />
  </Suspense>
);

export default Page;
