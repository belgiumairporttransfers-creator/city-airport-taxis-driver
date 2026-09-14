import { Suspense } from "react";
import { getSeoMeta } from "@/lib/get-seo-meta";
import LayoutLoader from "@/components/layout-loader";
import DriverBookingsListPage from "@/components/bookings/driver-bookings-list-page";

export const metadata = getSeoMeta({
  title: "Arrived Bookings",
  description: "View trips where you have arrived at pickup.",
});

const Page = () => (
  <Suspense fallback={<LayoutLoader />}>
    <DriverBookingsListPage viewKey="arrived" />
  </Suspense>
);

export default Page;
