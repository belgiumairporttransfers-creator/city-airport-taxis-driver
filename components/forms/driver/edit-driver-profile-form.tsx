"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  driverProfileSettingsFormSchema,
  type DriverProfileSettingsFormInput,
  type UpdateDriverProfilePayload,
} from "@/lib/schemas";
import type { DriverApplication } from "@/lib/schemas";
import { useDriverApplication, useUpdateDriverApplication } from "@/hooks/queries/use-driver";
import {
  DriverFormAlerts,
  DriverFormShell,
  isEditableStatus,
  pairGrid,
} from "./driver-form-shared";

const toFormValues = (application: DriverApplication): DriverProfileSettingsFormInput => ({
  operatingCountry: application.operatingCountry,
  operatingCity: application.operatingCity,
  firstName: application.firstName,
  lastName: application.lastName,
  email: application.email,
  phone: application.phone,
  homeAddress: application.homeAddress,
  yearsOfExperience: application.yearsOfExperience,
  about: application.about ?? "",
  skills: (application.skills ?? []).join(", "),
  profilePhoto: application.profilePhoto ?? "",
});

const EditDriverProfileForm = () => {
  const { data: application, isLoading, isError } = useDriverApplication();
  const { mutateAsync: updateApplication, isPending } = useUpdateDriverApplication();
  const [pendingUploads, setPendingUploads] = useState(0);

  const form = useForm<DriverProfileSettingsFormInput>({
    resolver: zodResolver(driverProfileSettingsFormSchema),
    mode: "onChange",
    defaultValues: {
      operatingCountry: "Netherlands",
      operatingCity: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      homeAddress: "",
      yearsOfExperience: 0,
      about: "",
      skills: "",
      profilePhoto: "",
    },
  });

  useEffect(() => {
    if (application) {
      form.reset(toFormValues(application));
    }
  }, [application, form]);

  const isBusy = isPending || pendingUploads > 0;
  const isLocked = application ? !isEditableStatus(application.status) : false;

  const onSubmit = async (values: DriverProfileSettingsFormInput) => {
    const { profilePhoto, skills, email: _email, ...rest } = values;

    const parsedSkills = skills
      ?.split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    const payload: UpdateDriverProfilePayload = {
      ...rest,
      profilePhoto: profilePhoto?.trim() || undefined,
      skills: parsedSkills?.length ? parsedSkills : undefined,
      about: rest.about?.trim() || undefined,
    };

    await updateApplication(payload);
  };

  return (
    <DriverFormShell isLoading={isLoading} isError={isError} application={application}>
      {(driver) => (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <DriverFormAlerts application={driver} />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
              <div className="space-y-5 lg:col-span-8">
                <div className={pairGrid}>
                  <Input name="firstName" label="First name" disabled={isLocked} />
                  <Input name="lastName" label="Last name" disabled={isLocked} />
                </div>

                <div className={pairGrid}>
                  <Input name="email" type="email" label="Email" disabled />
                  <Input name="phone" label="Phone" disabled={isLocked} />
                </div>

                <Input name="homeAddress" label="Home address" disabled={isLocked} />
                <Input name="about" type="textarea" label="About" rows={10} disabled={isLocked} />
              </div>

              <aside className="space-y-5 lg:col-span-4 lg:sticky lg:top-4">
                <FormField
                  control={form.control}
                  name="profilePhoto"
                  render={({ field, fieldState }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-default-600">
                        Profile photo
                      </FormLabel>
                      <FormControl>
                        <InstantFileUpload
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          hasError={!!fieldState.error}
                          accept={{ "image/jpeg": [], "image/png": [], "image/webp": [] }}
                          compact
                          folder="driver-applications"
                          disabled={isLocked}
                          onUploadStart={() => setPendingUploads((c) => c + 1)}
                          onUploadEnd={() => setPendingUploads((c) => Math.max(0, c - 1))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Input name="operatingCountry" label="Country" disabled={isLocked} />
                <Input name="operatingCity" label="City" disabled={isLocked} />
                <Input
                  name="yearsOfExperience"
                  type="number"
                  label="Years of experience"
                  disabled={isLocked}
                />
                <Input
                  name="skills"
                  label="Skills"
                  placeholder="Comma-separated skills"
                  disabled={isLocked}
                />
              </aside>
            </div>

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

export default EditDriverProfileForm;
