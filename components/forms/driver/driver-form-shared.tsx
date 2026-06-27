"use client";

import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import LayoutLoader from "@/components/layout-loader";
import { DRIVER_PORTAL_EDITABLE_STATUSES } from "@/lib/schemas";
import type { DriverApplication } from "@/lib/schemas";

export const DOCUMENT_ACCEPT = {
  "image/jpeg": [],
  "image/png": [],
  "image/webp": [],
  "application/pdf": [],
};

export const shiftOptions = [
  { label: "Day", value: "day" },
  { label: "Night", value: "night" },
  { label: "Both", value: "both" },
];

export const pairGrid = "grid grid-cols-1 gap-5 md:grid-cols-2";
export const tripleGrid = "grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3";
export const documentGrid = "grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3";

export const documentGroups: {
  title: string;
  fields: import("@/lib/schemas").DriverDocumentField[];
}[] = [
  {
    title: "ID & permits",
    fields: ["chauffeurPassFront", "chauffeurPassBack", "kiwaPermit"],
  },
  {
    title: "Driver license",
    fields: ["driverLicenseFront", "driverLicenseBack"],
  },
  {
    title: "Vehicle photos",
    fields: [
      "carCard",
      "carFrontView",
      "carBackView",
      "carLeftView",
      "carRightView",
      "carInsideView",
      "licensePlateView",
    ],
  },
  {
    title: "Business & insurance",
    fields: ["taxiInsurancePolicy", "kvkUittreksel", "bankCardCopy"],
  },
];

export const isEditableStatus = (status: DriverApplication["status"]) =>
  (DRIVER_PORTAL_EDITABLE_STATUSES as readonly string[]).includes(status);

export const DriverFormAlerts = ({ application }: { application: DriverApplication }) => {
  const isLocked = !isEditableStatus(application.status);

  return (
    <>
      {isLocked ? (
        <div className="flex items-start gap-3 rounded-lg border border-warning/30 bg-warning/5 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
          <div>
            <p className="text-sm font-medium text-default-900">Profile is locked</p>
            <p className="mt-1 text-sm text-default-600">
              Your application status is &quot;{application.status.replace(/_/g, " ")}&quot; and
              cannot be edited at this time.
            </p>
          </div>
        </div>
      ) : null}

      {application.reviewNotes && application.status === "changes_requested" ? (
        <div className="rounded-lg border border-warning/30 bg-warning/5 p-4">
          <p className="text-sm font-medium text-default-900">Changes requested</p>
          <p className="mt-1 text-sm text-default-600">{application.reviewNotes}</p>
        </div>
      ) : null}
    </>
  );
};

export const DriverFormShell = ({
  isLoading,
  isError,
  application,
  children,
}: {
  isLoading: boolean;
  isError: boolean;
  application?: DriverApplication;
  children: (application: DriverApplication) => React.ReactNode;
}) => {
  if (isLoading) {
    return <LayoutLoader />;
  }

  if (isError || !application) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-default-600">
            No driver application was found. Contact support if you believe this is an error.
          </p>
        </CardContent>
      </Card>
    );
  }

  return <>{children(application)}</>;
};
