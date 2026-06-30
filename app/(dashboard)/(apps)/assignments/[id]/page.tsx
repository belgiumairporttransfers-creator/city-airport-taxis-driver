import { getSeoMeta } from "@/lib/get-seo-meta";
import AssignmentDetailPageView from "./page-view";

export const metadata = getSeoMeta({
  title: "Assignment Details",
  description: "Review assignment details and accept or reject the trip.",
});

const AssignmentDetailPage = () => {
  return <AssignmentDetailPageView />;
};

export default AssignmentDetailPage;
