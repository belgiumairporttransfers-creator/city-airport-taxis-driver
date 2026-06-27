"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form } from "@/components/ui/form";
import {
  driverVehicleSettingsFormSchema,
  type DriverVehicleSettingsFormInput,
  type UpdateDriverProfilePayload,
} from "@/lib/schemas";
import type { DriverApplication } from "@/lib/schemas";
import { useDriverApplication, useUpdateDriverApplication } from "@/hooks/queries/use-driver";
import {
  DriverFormAlerts,
  DriverFormShell,
  isEditableStatus,
  shiftOptions,
  tripleGrid,
} from "./driver-form-shared";

const toFormValues = (application: DriverApplication): DriverVehicleSettingsFormInput => ({
  carType: application.carType,
  carColor: application.carColor,
  licensePlate: application.licensePlate,
  carYearModel: application.carYearModel,
  shiftType: application.shiftType,
  availableFrom: application.availableFrom,
  availableTo: application.availableTo,
});

const EditDriverVehicleForm = () => {
  const { data: application, isLoading, isError } = useDriverApplication();
  const { mutateAsync: updateApplication, isPending } = useUpdateDriverApplication();

  const form = useForm<DriverVehicleSettingsFormInput>({
    resolver: zodResolver(driverVehicleSettingsFormSchema),
    mode: "onChange",
    defaultValues: {
      carType: "",
      carColor: "",
      licensePlate: "",
      carYearModel: "",
      shiftType: "both",
      availableFrom: "06:00",
      availableTo: "22:00",
    },
  });

  useEffect(() => {
    if (application) {
      form.reset(toFormValues(application));
    }
  }, [application, form]);

  const isLocked = application ? !isEditableStatus(application.status) : false;

  const onSubmit = async (values: DriverVehicleSettingsFormInput) => {
    const payload: UpdateDriverProfilePayload = { ...values };
    await updateApplication(payload);
  };

  return (
    <DriverFormShell isLoading={isLoading} isError={isError} application={application}>
      {(driver) => (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <DriverFormAlerts application={driver} />

            <div className={tripleGrid}>
              <Input name="carType" label="Vehicle type" disabled={isLocked} />
              <Input name="carColor" label="Color" disabled={isLocked} />
              <Input name="carYearModel" label="Year / model" disabled={isLocked} />
              <Input name="licensePlate" label="License plate" disabled={isLocked} />
              <Input
                name="shiftType"
                type="select"
                label="Shift"
                options={shiftOptions}
                disabled={isLocked}
              />
              <Input name="availableFrom" type="time" label="Available from" disabled={isLocked} />
              <Input name="availableTo" type="time" label="Available to" disabled={isLocked} />
            </div>

            {!isLocked ? (
              <div className="flex justify-end border-t border-border pt-6">
                <Button type="submit" isLoading={isPending} loadingText="Saving...">
                  <Save className="mr-2 h-4 w-4" />
                  Save changes
                </Button>
              </div>
            ) : null}
          </form>
        </Form>
      )}
    </DriverFormShell>
  );
};

export default EditDriverVehicleForm;
