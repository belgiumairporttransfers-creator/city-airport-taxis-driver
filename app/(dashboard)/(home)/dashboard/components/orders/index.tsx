"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import OrdersTable from "./orders-table";

const Orders = () => {
  return (
    <Card>
      <CardHeader className="mb-0 p-6">
        <CardTitle>Recent Completed Bookings</CardTitle>
        <p className="mt-1 text-sm text-default-500">
          Latest trips you have marked complete
        </p>
      </CardHeader>
      <CardContent className="px-0">
        <OrdersTable />
      </CardContent>
    </Card>
  );
};

export default Orders;
