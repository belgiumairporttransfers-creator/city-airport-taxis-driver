"use client";

import React from "react";
import Link from "next/link";
import { Home, TrendingUp, Wallet, PiggyBank, Car } from "lucide-react";
import LayoutLoader from "@/components/layout-loader";
import DriverWalletTransactionsTable from "@/components/wallet/driver-wallet-transactions-table";
import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDriverWallet, useDriverWalletTransactions } from "@/hooks/queries/use-wallet";
import { formatPrice } from "@/lib/utils";

const SummaryCard = ({
  title,
  value,
  hint,
  icon: Icon,
}: {
  title: string;
  value: string;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
}) => (
  <Card>
    <CardContent className="flex items-start justify-between gap-4 p-5">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-default-500">{title}</p>
        <p className="mt-2 text-2xl font-bold text-default-900">{value}</p>
        <p className="mt-1 text-xs text-default-500">{hint}</p>
      </div>
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
    </CardContent>
  </Card>
);

const DriverWalletPageView = () => {
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(10);

  const { data: summary, isLoading, isError } = useDriverWallet();
  const {
    data: transactions,
    isLoading: transactionsLoading,
    isFetching,
  } = useDriverWalletTransactions({ page, limit });

  if (isLoading) {
    return <LayoutLoader />;
  }

  if (isError || !summary) {
    return <p className="text-destructive">Unable to load wallet.</p>;
  }

  const totalPages = transactions?.meta.totalPages ?? 1;

  return (
    <>
      <Breadcrumbs>
        <BreadcrumbItem>
          <Home className="h-4 w-4" />
        </BreadcrumbItem>
        <BreadcrumbItem>Operations</BreadcrumbItem>
        <BreadcrumbItem>Wallet</BreadcrumbItem>
      </Breadcrumbs>

      <div className="mt-6 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-default-900">Driver Wallet</h1>
          <p className="mt-1 text-sm text-default-500">
            Track your trip earnings and wallet balance. A {summary.commissionPercent}% platform fee is
            deducted from each trip before your earning is credited.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            title="Available Balance"
            value={formatPrice(summary.availableBalance)}
            hint="Ready in your wallet"
            icon={Wallet}
          />
          <SummaryCard
            title="Total Earned"
            value={formatPrice(summary.totalEarned)}
            hint="All-time trip earnings"
            icon={PiggyBank}
          />
          <SummaryCard
            title="This Month"
            value={formatPrice(summary.thisMonthEarned)}
            hint={`Last month: ${formatPrice(summary.lastMonthEarned)}`}
            icon={TrendingUp}
          />
          <SummaryCard
            title="Completed Trips"
            value={String(summary.totalTrips)}
            hint="Trips credited to wallet"
            icon={Car}
          />
        </div>

        <Card>
          <CardHeader className="border-b border-border px-5 py-4">
            <CardTitle className="text-lg font-semibold text-default-900">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <DriverWalletTransactionsTable transactions={summary.recentTransactions} />
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="border-b border-border px-5 py-4">
            <CardTitle className="text-lg font-semibold text-default-900">Transaction History</CardTitle>
            <p className="mt-0.5 text-xs text-default-500">
              Full ledger of credits from completed trips.
            </p>
          </CardHeader>
          <CardContent className="space-y-4 p-4">
            <DriverWalletTransactionsTable
              transactions={transactions?.items ?? []}
              loading={transactionsLoading || isFetching}
            />

            {totalPages > 1 ? (
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-default-500">
                  Page {page} of {totalPages} · {transactions?.meta.total ?? 0} total
                </p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={page <= 1 || transactionsLoading}
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                  >
                    Previous
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages || transactionsLoading}
                    onClick={() => setPage((current) => current + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium text-default-900">Keep completing trips to grow your wallet</p>
              <p className="mt-1 text-sm text-default-500">
                Earnings are added automatically when you mark a trip as completed.
              </p>
            </div>
            <Button asChild>
              <Link href="/trips">View Active Trips</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default DriverWalletPageView;
