"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuthActivities } from "@/hooks/queries/use-auth";
import type { Activity } from "@/lib/schemas";
import { format } from "date-fns";
import LayoutLoader from "@/components/layout-loader";

const activityLabels: Record<Activity["type"], string> = {
  login: "Logged in",
  logout: "Logged out",
  password_change: "Password changed",
  password_reset: "Password reset",
  password_reset_request: "Password reset requested",
  update_profile: "Profile updated",
  logout_all: "Logged out from all devices",
  email_verified: "Email verified",
  session_revoked: "Session revoked",
};

const getDeviceLabel = (activity: Activity) => {
  const parts = [activity.browser, activity.os, activity.device].filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : activity.ipAddress ?? "Unknown device";
};

const RecentActivities = () => {
  const { data: activities, isLoading } = useAuthActivities();

  if (isLoading) {
    return <LayoutLoader />;
  }

  return (
    <Card>
      <CardHeader className="border-none mb-0 pb-3 px-5 pt-5">
        <CardTitle className="text-lg font-medium text-default-800">Activity History</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {!activities?.length ? (
          <p className="text-sm text-default-500 px-5 py-4">No recent activities.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {["Activity", "Device", "Time"].map((column, index) => (
                  <TableHead
                    key={`column-${index}`}
                    className="border-t border-border first:pl-5 last:pr-5 whitespace-nowrap"
                  >
                    {column}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map((activity) => (
                <TableRow key={activity._id} className="border-border">
                  <TableCell className="py-2 text-sm font-medium text-default-600 whitespace-nowrap first:pl-5 capitalize">
                    {activityLabels[activity.type]}
                    {activity.status === "failed" && (
                      <span className="text-destructive"> (failed)</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-default-600 py-2">
                    {getDeviceLabel(activity)}
                  </TableCell>
                  <TableCell className="text-sm text-default-600 py-2 whitespace-nowrap last:pr-5">
                    {format(new Date(activity.timestamp), "dd MMM yyyy, HH:mm")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivities;
