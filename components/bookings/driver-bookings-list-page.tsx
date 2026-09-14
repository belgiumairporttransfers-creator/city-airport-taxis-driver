"use client";

import React from "react";
import { Home } from "lucide-react";
import DriverBookingsTable from "@/components/bookings/driver-bookings-table";
import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useDriverBookings } from "@/hooks/queries/use-driver-bookings";
import {
  DRIVER_BOOKING_LIST_VIEWS,
  type DriverBookingListViewKey,
} from "@/lib/booking-list-views";

type DriverBookingsListPageProps = {
  viewKey: DriverBookingListViewKey;
};

const DriverBookingsListPage = ({ viewKey }: DriverBookingsListPageProps) => {
  const view = DRIVER_BOOKING_LIST_VIEWS[viewKey];
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(10);
  const [search, setSearch] = React.useState("");

  const { data, isLoading, isFetching } = useDriverBookings({
    page,
    limit,
    search,
    scope: view.scope,
    tripPhase: view.tripPhase,
  });

  const totalPages = data?.meta.totalPages ?? 1;

  return (
    <>
      <Breadcrumbs>
        <BreadcrumbItem>
          <Home className="h-4 w-4" />
        </BreadcrumbItem>
        <BreadcrumbItem>Operations</BreadcrumbItem>
        <BreadcrumbItem>{view.title}</BreadcrumbItem>
      </Breadcrumbs>

      <Card className="mt-6 overflow-hidden">
        <CardHeader className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-default-900">
              {view.title}
            </CardTitle>
            <p className="mt-0.5 text-xs text-default-500">{view.description}</p>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 p-4">
          <Input
            placeholder={view.searchPlaceholder ?? "Search by booking #, customer, or address"}
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            className="max-w-sm"
          />

          <DriverBookingsTable
            bookings={data?.items ?? []}
            search={search}
            onSearchChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            loading={isLoading || isFetching}
            showCompleteAction={view.showCompleteAction ?? true}
            hideSearch
          />

          {totalPages > 1 ? (
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-default-500">
                Page {page} of {totalPages} · {data?.meta.total ?? 0} total
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={page <= 1 || isLoading}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                >
                  Previous
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages || isLoading}
                  onClick={() => setPage((current) => current + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </>
  );
};

export default DriverBookingsListPage;
