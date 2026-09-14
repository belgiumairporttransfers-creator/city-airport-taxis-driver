import { Suspense } from "react";
import { getSeoMeta } from "@/lib/get-seo-meta";
import LayoutLoader from "@/components/layout-loader";
import DriverBookingsListPage from "@/components/bookings/driver-bookings-list-page";

export const metadata = getSeoMeta({
  title: "Passenger Onboard",
  description: "View trips where the passenger is onboard.",
});

const Page = () => (
  <Suspense fallback={<LayoutLoader />}>
    <DriverBookingsListPage viewKey="onboard" />
  </Suspense>
);

export default Page;
