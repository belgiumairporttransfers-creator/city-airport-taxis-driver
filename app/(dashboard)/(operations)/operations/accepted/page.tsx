import { Suspense } from "react";
import { getSeoMeta } from "@/lib/get-seo-meta";
import LayoutLoader from "@/components/layout-loader";
import DriverBookingsListPage from "@/components/bookings/driver-bookings-list-page";

export const metadata = getSeoMeta({
  title: "Accepted Bookings",
  description: "View accepted bookings waiting for arrival.",
});

const Page = () => (
  <Suspense fallback={<LayoutLoader />}>
    <DriverBookingsListPage viewKey="accepted" />
  </Suspense>
);

export default Page;
