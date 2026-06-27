import { getSeoMeta } from "@/lib/get-seo-meta";
import DashboardPageView from "./page-view";

export const metadata = getSeoMeta({
  title: "Dashboard",
  description:
    "View your trips, earnings, schedule, and driver activity on the City Airport Taxis driver dashboard.",
});

const Dashboard = () => {
  return <DashboardPageView />;
};

export default Dashboard;
