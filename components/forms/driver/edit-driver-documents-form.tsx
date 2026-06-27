"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { InstantFileUpload } from "@/components/file-upload/instant-file-upload";
import {
  DRIVER_DOCUMENT_FIELDS,
  DRIVER_DOCUMENT_LABELS,
  driverDocumentsFormSchema,
  type DriverDocumentField,
  type DriverDocumentsFormInput,
  type DriverDocumentsPayload,
  type UpdateDriverProfilePayload,
} from "@/lib/schemas";
import type { DriverApplication } from "@/lib/schemas";
import { useDriverApplication, useUpdateDriverApplication } from "@/hooks/queries/use-driver";
import type { Accept } from "react-dropzone";
import {
  DOCUMENT_ACCEPT,
  documentGrid,
  documentGroups,
  DriverFormAlerts,
  DriverFormShell,
  isEditableStatus,
} from "./driver-form-shared";

const documentDefaults = Object.fromEntries(
  DRIVER_DOCUMENT_FIELDS.map((field) => [field, ""])
) as Record<DriverDocumentField, string>;

const toFormValues = (application: DriverApplication): DriverDocumentsFormInput => {
  const documents = application.documents ?? {};

  return Object.fromEntries(
    DRIVER_DOCUMENT_FIELDS.map((field) => [field, documents[field] ?? ""])
  ) as DriverDocumentsFormInput;
};

const EditDriverDocumentsForm = () => {
  const { data: application, isLoading, isError } = useDriverApplication();
  const { mutateAsync: updateApplication, isPending } = useUpdateDriverApplication();
  const [pendingUploads, setPendingUploads] = useState(0);

  const form = useForm<DriverDocumentsFormInput>({
    resolver: zodResolver(driverDocumentsFormSchema),
    mode: "onChange",
    defaultValues: documentDefaults,
  });

  useEffect(() => {
    if (application) {
      form.reset(toFormValues(application));
    }
  }, [application, form]);

  const isBusy = isPending || pendingUploads > 0;
  const isLocked = application ? !isEditableStatus(application.status) : false;

  const handleUploadStart = () => setPendingUploads((count) => count + 1);
  const handleUploadEnd = () => setPendingUploads((count) => Math.max(0, count - 1));

  const onSubmit = async (values: DriverDocumentsFormInput) => {
    const documents = Object.fromEntries(
      DRIVER_DOCUMENT_FIELDS.map((field) => [field, values[field]])
    ) as DriverDocumentsPayload;

    const payload: UpdateDriverProfilePayload = { documents };
    await updateApplication(payload);
  };

  const renderInstantUploadField = (
    name: DriverDocumentField,
    label: string,
    options?: { accept?: Accept; compact?: boolean }
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className="space-y-2">
          <FormLabel className="text-sm font-medium text-default-600">{label}</FormLabel>
          <FormControl>
            <InstantFileUpload
              value={field.value ?? ""}
              onChange={field.onChange}
              hasError={!!fieldState.error}
              accept={options?.accept ?? DOCUMENT_ACCEPT}
              compact={options?.compact}
              folder="driver-applications"
              disabled={isLocked}
              onUploadStart={handleUploadStart}
              onUploadEnd={handleUploadEnd}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <DriverFormShell isLoading={isLoading} isError={isError} application={application}>
      {(driver) => (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <DriverFormAlerts application={driver} />

            <div>
              <p className="text-sm font-medium text-default-600">Upload documents</p>
              <p className="mt-1 text-xs text-default-500">
                Each file uploads immediately when selected. Review the preview before saving.
              </p>
            </div>

            {documentGroups.map((group) => (
              <div
                key={group.title}
                className="space-y-5 rounded-lg border border-border/80 bg-default-50/30 p-5"
              >
                <p className="text-sm font-medium text-default-600">{group.title}</p>
                <div className={documentGrid}>
                  {group.fields.map((field) => (
                    <div key={field}>
                      {renderInstantUploadField(field, DRIVER_DOCUMENT_LABELS[field], {
                        compact: true,
                      })}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {!isLocked ? (
              <div className="flex justify-end border-t border-border pt-6">
                <Button
                  type="submit"
                  disabled={isBusy}
                  isLoading={isPending}
                  loadingText="Saving..."
                >
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

export default EditDriverDocumentsForm;
