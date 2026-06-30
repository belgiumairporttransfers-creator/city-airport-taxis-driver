import { redirect } from "next/navigation";

const AssignmentsRedirectPage = () => {
  redirect("/operations/bookings?tab=assignments");
};

export default AssignmentsRedirectPage;
