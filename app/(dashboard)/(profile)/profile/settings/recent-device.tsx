"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useAuthLogoutAllDevices,
  useAuthRevokeSession,
  useAuthSessions,
} from "@/hooks/queries/use-auth";
import type { AuthSession } from "@/lib/schemas";
import { format } from "date-fns";
import LayoutLoader from "@/components/layout-loader";
import Image, { StaticImageData } from "next/image";
import windowsImage from "@/public/images/social/windows.png";
import androidImage from "@/public/images/social/android.png";
import macImage from "@/public/images/social/mac.png";
import iphoneImage from "@/public/images/social/iphone.png";
import webImage from "@/public/images/social/web.png";

const getBrowserLabel = (session: AuthSession) => {
  if (session.browser && session.os) return `${session.browser} on ${session.os}`;
  if (session.browser) return session.browser;
  if (session.os) return session.os;
  return "Unknown browser";
};

const getBrowserIcon = (session: AuthSession): StaticImageData => {
  const os = (session.os ?? "").toLowerCase();
  const device = (session.device ?? "").toLowerCase();

  if (os.includes("ios") || device.includes("iphone") || device.includes("ipad")) {
    return iphoneImage;
  }
  if (os.includes("android")) {
    return androidImage;
  }
  if (os.includes("mac") || os.includes("darwin")) {
    return macImage;
  }
  if (os.includes("windows")) {
    return windowsImage;
  }
  if (os.includes("linux")) {
    return webImage;
  }
  return webImage;
};

const RecentDevice = () => {
  const { data: sessions, isLoading } = useAuthSessions();
  const { mutate: revokeSession, isPending: isRevoking, variables } = useAuthRevokeSession();
  const { mutate: logoutAll, isPending: isLoggingOutAll } = useAuthLogoutAllDevices();

  if (isLoading) {
    return <LayoutLoader />;
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center border-none mb-0 pb-3 px-5 pt-5">
        <CardTitle className="flex-1 text-lg font-medium text-default-800">
          Active Sessions
        </CardTitle>
        <Button
          className="flex-none"
          size="sm"
          variant="outline"
          disabled={!sessions?.length || isLoggingOutAll}
          onClick={() => logoutAll()}
        >
          Logout All
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {!sessions?.length ? (
          <p className="text-sm text-default-500 px-5 py-4">No active logged-in devices.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {["Browser", "Device", "Location", "Last Active", "Action"].map(
                  (column, index) => (
                    <TableHead
                      key={`column-${index}`}
                      className="last:text-right border-t border-border first:pl-5 last:pr-5 whitespace-nowrap"
                    >
                      {column}
                    </TableHead>
                  )
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((session) => (
                <TableRow key={session._id} className="border-border">
                  <TableCell className="py-2 text-sm font-medium text-default-600 whitespace-nowrap first:pl-5">
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 grid place-content-center rounded bg-default-100 dark:bg-default-50 shrink-0">
                        <Image
                          className="w-3.5 h-3.5"
                          src={getBrowserIcon(session)}
                          alt={getBrowserLabel(session)}
                        />
                      </div>
                      {getBrowserLabel(session)}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-default-600 py-2 whitespace-nowrap">
                    {session.device ?? "Unknown"}
                  </TableCell>
                  <TableCell className="text-sm text-default-600 py-2 whitespace-nowrap">
                    {session.ipAddress}
                  </TableCell>
                  <TableCell className="text-sm text-default-600 py-2 whitespace-nowrap">
                    {format(new Date(session.createdAt), "dd MMM yyyy, HH:mm")}
                  </TableCell>
                  <TableCell className="text-right py-2 last:pr-5">
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={isRevoking && variables === session._id}
                      onClick={() => revokeSession(session._id)}
                    >
                      Logout
                    </Button>
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

export default RecentDevice;
