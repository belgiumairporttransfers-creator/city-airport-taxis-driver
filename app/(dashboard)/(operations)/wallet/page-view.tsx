"use client";

import React from "react";
import Link from "next/link";
import {
  Banknote,
  CalendarDays,
  Car,
  Home,
  PiggyBank,
  TrendingUp,
  Wallet,
} from "lucide-react";
import LayoutLoader from "@/components/layout-loader";
import DriverWalletTransactionsTable from "@/components/wallet/driver-wallet-transactions-table";
import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useDriverWallet,
  useDriverWalletPayouts,
  useDriverWalletTransactions,
  useRequestDriverPayout,
} from "@/hooks/queries/use-wallet";
import { useDriverDashboard } from "@/hooks/queries/use-dashboard";
import { formatDate, formatPrice, formatTime } from "@/lib/utils";

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

const payoutStatusClasses: Record<string, string> = {
  pending: "bg-warning/10 text-warning",
  completed: "bg-success/10 text-success",
  failed: "bg-destructive/10 text-destructive",
};

const DriverWalletPageView = () => {
  const [page, setPage] = React.useState(1);
  const [payoutPage, setPayoutPage] = React.useState(1);
  const [limit] = React.useState(10);
  const [payoutOpen, setPayoutOpen] = React.useState(false);
  const [amount, setAmount] = React.useState("");
  const [note, setNote] = React.useState("");

  const { data: summary, isLoading, isError } = useDriverWallet();
  const { data: dashboard } = useDriverDashboard();
  const recentCompleted = dashboard?.recentOrders ?? [];
  const {
    data: transactions,
    isLoading: transactionsLoading,
    isFetching,
  } = useDriverWalletTransactions({ page, limit });
  const {
    data: payouts,
    isLoading: payoutsLoading,
    isFetching: payoutsFetching,
  } = useDriverWalletPayouts({ page: payoutPage, limit });
  const { mutate: requestPayout, isPending: isRequesting } = useRequestDriverPayout();

  if (isLoading) {
    return <LayoutLoader />;
  }

  if (isError || !summary) {
    return <p className="text-destructive">Unable to load wallet.</p>;
  }

  const totalPages = transactions?.meta.totalPages ?? 1;
  const payoutTotalPages = payouts?.meta.totalPages ?? 1;
  const spendable = summary.spendableBalance ?? summary.availableBalance;

  const handleRequestPayout = () => {
    const parsed = Number(amount);

    if (!Number.isFinite(parsed) || parsed <= 0) {
      return;
    }

    requestPayout(
      {
        amount: parsed,
        ...(note.trim() ? { note: note.trim() } : {}),
      },
      {
        onSuccess: () => {
          setPayoutOpen(false);
          setAmount("");
          setNote("");
        },
      }
    );
  };

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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-default-900">Driver Wallet</h1>
            <p className="mt-1 text-sm text-default-500">
              Track earnings, request payouts, and review your wallet history.
            </p>
          </div>
          <Button
            type="button"
            onClick={() => setPayoutOpen(true)}
            disabled={spendable <= 0}
          >
            Request Payout
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <SummaryCard
            title="Available Balance"
            value={formatPrice(summary.availableBalance)}
            hint={
              summary.pendingPayouts > 0
                ? `Spendable: ${formatPrice(spendable)} · Pending: ${formatPrice(summary.pendingPayouts)}`
                : "Ready in your wallet"
            }
            icon={Wallet}
          />
          <SummaryCard
            title="Today Earned"
            value={formatPrice(summary.todayEarned)}
            hint="Credits from trips completed today"
            icon={CalendarDays}
          />
          <SummaryCard
            title="Total Earned"
            value={formatPrice(summary.totalEarned)}
            hint="All-time trip earnings"
            icon={PiggyBank}
          />
          <SummaryCard
            title="Total Paid Out"
            value={formatPrice(summary.totalPaidOut)}
            hint="Approved payouts to date"
            icon={Banknote}
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

        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between gap-3 border-b border-border px-5 py-4">
            <div>
              <CardTitle className="text-lg font-semibold text-default-900">
                Recent Completed Bookings
              </CardTitle>
              <p className="mt-0.5 text-xs text-default-500">
                Latest trips you completed and earned from.
              </p>
            </div>
            <Button asChild size="sm" variant="outline">
              <Link href="/operations/completed">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-default-50 text-left">
                    <th className="px-4 py-3 font-medium text-default-600">Booking</th>
                    <th className="px-4 py-3 font-medium text-default-600">Customer</th>
                    <th className="px-4 py-3 font-medium text-default-600">Completed</th>
                    <th className="px-4 py-3 text-right font-medium text-default-600">
                      Your payout
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentCompleted.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-default-500">
                        No completed bookings yet.
                      </td>
                    </tr>
                  ) : (
                    recentCompleted.map((booking) => (
                      <tr key={booking.id} className="border-b border-border last:border-0">
                        <td className="px-4 py-3">
                          <Link
                            href={`/bookings/${booking.id}`}
                            className="font-medium text-primary hover:underline"
                          >
                            {booking.bookingNumber}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-default-700">{booking.customerName}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-default-600">
                          {formatDate(booking.date)} {formatTime(booking.date)}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-default-900">
                          {formatPrice(booking.amount)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="border-b border-border px-5 py-4">
            <CardTitle className="text-lg font-semibold text-default-900">
              Transaction History
            </CardTitle>
            <p className="mt-0.5 text-xs text-default-500">
              Full ledger of trip earnings and payouts.
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

        <Card className="overflow-hidden">
          <CardHeader className="border-b border-border px-5 py-4">
            <CardTitle className="text-lg font-semibold text-default-900">My Payouts</CardTitle>
            <p className="mt-0.5 text-xs text-default-500">
              Payout requests waiting for admin approval or already processed.
            </p>
          </CardHeader>
          <CardContent className="space-y-4 p-4">
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-default-50 text-left">
                    <th className="px-4 py-3 font-medium text-default-600">Amount</th>
                    <th className="px-4 py-3 font-medium text-default-600">Status</th>
                    <th className="px-4 py-3 font-medium text-default-600">Requested</th>
                    <th className="px-4 py-3 font-medium text-default-600">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {payoutsLoading || payoutsFetching ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-default-500">
                        Loading payouts...
                      </td>
                    </tr>
                  ) : (payouts?.items.length ?? 0) === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-default-500">
                        No payout requests yet.
                      </td>
                    </tr>
                  ) : (
                    payouts?.items.map((payout) => (
                      <tr key={payout.id} className="border-b border-border last:border-0">
                        <td className="px-4 py-3 font-semibold text-default-900">
                          {formatPrice(payout.amount)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                              payoutStatusClasses[payout.status] ??
                              "bg-default-100 text-default-600"
                            }`}
                          >
                            {payout.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-default-600">
                          {formatDate(payout.createdAt)} {formatTime(payout.createdAt)}
                        </td>
                        <td className="px-4 py-3 text-default-600">
                          {payout.requestNote || "—"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {payoutTotalPages > 1 ? (
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-default-500">
                  Page {payoutPage} of {payoutTotalPages} · {payouts?.meta.total ?? 0} total
                </p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={payoutPage <= 1 || payoutsLoading}
                    onClick={() => setPayoutPage((current) => Math.max(1, current - 1))}
                  >
                    Previous
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={payoutPage >= payoutTotalPages || payoutsLoading}
                    onClick={() => setPayoutPage((current) => current + 1)}
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
              <p className="font-medium text-default-900">
                Keep completing trips to grow your wallet
              </p>
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

      <Dialog open={payoutOpen} onOpenChange={setPayoutOpen}>
        <DialogContent size="md" className="p-0">
          <DialogHeader className="border-b border-border px-5 py-4">
            <DialogTitle>Request payout</DialogTitle>
            <DialogDescription>
              Available to request: {formatPrice(spendable)}. Admin must approve before the
              amount leaves your wallet.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 px-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="payout-amount">Amount (EUR)</Label>
              <Input
                id="payout-amount"
                type="number"
                min={0.01}
                step={0.01}
                max={spendable}
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="0.00"
                disabled={isRequesting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payout-note">Note (optional)</Label>
              <Textarea
                id="payout-note"
                rows={3}
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Bank reference or note for admin"
                disabled={isRequesting}
              />
            </div>
          </div>
          <DialogFooter className="border-t border-border px-5 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setPayoutOpen(false)}
              disabled={isRequesting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleRequestPayout}
              disabled={isRequesting || !amount || Number(amount) <= 0}
            >
              {isRequesting ? "Submitting…" : "Submit request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DriverWalletPageView;
