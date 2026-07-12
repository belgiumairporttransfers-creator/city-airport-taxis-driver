"use client";

import Link from "next/link";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate, formatPrice } from "@/lib/utils";
import { useDriverDashboard } from "@/hooks/queries/use-dashboard";

type DriverTransaction = {
  id: string;
  name: string;
  reference: string;
  amount: number;
  currency: string;
  direction: string;
  type: string;
  status: string;
  createdAt: string;
};

const statusLabels: Record<string, string> = {
  completed: "Completed",
  pending: "Pending",
  failed: "Failed",
};

const statusClasses: Record<string, string> = {
  completed: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  failed: "bg-destructive/10 text-destructive",
};

const columns: ColumnDef<DriverTransaction>[] = [
  {
    accessorKey: "reference",
    header: "Booking",
    cell: ({ row }) => (
      <span className="font-medium text-primary whitespace-nowrap">
        {row.original.reference}
      </span>
    ),
  },
  {
    accessorKey: "name",
    header: "Description",
    cell: ({ row }) => (
      <span className="whitespace-nowrap">{row.getValue("name")}</span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => (
      <span className="whitespace-nowrap">
        {formatDate(row.getValue("createdAt"))}
      </span>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const isDebit = row.original.direction === "debit";
      return (
        <span className="whitespace-nowrap">
          {isDebit ? "-" : ""}
          {formatPrice(row.original.amount)}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <span
          className={`inline-block rounded-2xl px-3 py-[2px] text-xs ${
            statusClasses[status] ?? "bg-default-100 text-default-600"
          }`}
        >
          {statusLabels[status] ?? status}
        </span>
      );
    },
  },
];

const Transaction = () => {
  const { data, isLoading } = useDriverDashboard();
  const table = useReactTable({
    data: data?.transactions ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Card>
      <CardHeader className="mb-0 p-6">
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <div className="overflow-x-auto">
          <div className="h-full w-full overflow-auto no-scrollbar">
            <Table>
              <TableHeader className="bg-default-300">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="text-sm font-semibold text-default-600 h-12 last:text-end whitespace-nowrap"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="[&_tr:last-child]:border-1">
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      Loading transactions...
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className="hover:bg-default-50 border-border"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className="text-sm text-default-600 py-3 last:text-end"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No transactions yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {(data?.transactions?.length ?? 0) > 0 ? (
          <div className="mt-5 flex justify-center">
            <Button asChild size="sm" variant="outline">
              <Link href="/wallet">View all transactions</Link>
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default Transaction;
