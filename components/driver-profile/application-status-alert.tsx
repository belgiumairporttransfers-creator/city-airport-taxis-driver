import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { DriverApplication } from "@/lib/schemas";

type ApplicationStatusAlertProps = {
  driver: DriverApplication;
};

const statusMessages: Partial<Record<DriverApplication["status"], string>> = {
  pending: "Your application is pending review.",
  under_review: "Your application is currently under review.",
  changes_requested: "Updates are required on your application.",
  rejected: "Your application was not approved.",
  suspended: "Your driver account is currently suspended.",
};

const ApplicationStatusAlert = ({ driver }: ApplicationStatusAlertProps) => {
  if (driver.status === "approved") {
    return null;
  }

  return (
    <Card className="border-warning/30 bg-warning/5">
      <CardContent className="flex items-start gap-3 p-4">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-default-900">
            {statusMessages[driver.status] ?? "Application status update"}
          </p>
          {driver.reviewNotes ? (
            <p className="text-sm text-default-600">{driver.reviewNotes}</p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationStatusAlert;
