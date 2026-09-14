"use client";

import * as React from "react";
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
import { Button } from "@/components/ui/button";
import { formatDate, formatPrice } from "@/lib/utils";
import { useDriverDashboard } from "@/hooks/queries/use-dashboard";

type DriverOrder = {
  id: string;
  bookingNumber: string;
  customerName: string;
  date: string;
  amount: number;
  status: string;
  isComplete: boolean;
};

const columns: ColumnDef<DriverOrder>[] = [
  {
    accessorKey: "bookingNumber",
    header: "Booking",
    cell: ({ row }) => (
      <Link
        href={`/bookings/${row.original.id}`}
        className="font-medium text-primary hover:underline"
      >
        {row.original.bookingNumber}
      </Link>
    ),
  },
  {
    accessorKey: "customerName",
    header: "Customer",
    cell: ({ row }) => (
      <span className="whitespace-nowrap">{row.getValue("customerName")}</span>
    ),
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => (
      <span className="whitespace-nowrap">{formatDate(row.getValue("date"))}</span>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => <span>{formatPrice(row.original.amount)}</span>,
  },
  {
    accessorKey: "isComplete",
    header: "Order Status",
    cell: ({ row }) => (
      <div className="whitespace-nowrap">
        {row.original.isComplete ? (
          <span className="inline-block px-3 py-[2px] rounded-2xl bg-success/10 text-xs text-success">
            Completed
          </span>
        ) : (
          <span className="inline-block px-3 py-[2px] rounded-2xl bg-warning/10 text-xs text-warning">
            Active
          </span>
        )}
      </div>
    ),
  },
];

const OrdersTable = () => {
  const { data, isLoading } = useDriverDashboard();
  const table = useReactTable({
    data: data?.recentOrders ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
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
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    Loading completed bookings...
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
                        className="text-sm text-default-600 py-3 last:text-end "
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
                    No completed bookings yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {(data?.recentOrders?.length ?? 0) > 0 ? (
        <div className="mt-5 flex justify-center">
          <Button asChild size="sm" variant="outline">
            <Link href="/operations/completed">View all completed</Link>
          </Button>
        </div>
      ) : null}
    </>
  );
};

export default OrdersTable;
