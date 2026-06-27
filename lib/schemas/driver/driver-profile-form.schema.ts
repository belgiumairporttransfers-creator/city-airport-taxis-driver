import { z } from "zod";
import {
  DRIVER_DOCUMENT_FIELDS,
  driverShiftTypeSchema,
  type DriverDocumentField,
} from "./driver-application.schema";

const timeSchema = z
  .string()
  .trim()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Time must be in HH:mm format");

const requiredDocumentUrlSchema = z
  .string()
  .trim()
  .url({ message: "Document is required" });

const documentFormFields = Object.fromEntries(
  DRIVER_DOCUMENT_FIELDS.map((field) => [field, requiredDocumentUrlSchema])
) as Record<DriverDocumentField, typeof requiredDocumentUrlSchema>;

const driverProfileFormBaseSchema = z.object({
  operatingCountry: z.string().trim().min(1, "Country is required").max(120),
  operatingCity: z.string().trim().min(1, "City is required").max(120),
  firstName: z.string().trim().min(1, "First name is required").max(80),
  lastName: z.string().trim().min(1, "Last name is required").max(80),
  email: z.string().trim().email("Valid email is required"),
  phone: z.string().trim().min(5, "Phone is required").max(30),
  homeAddress: z.string().trim().min(1, "Address is required").max(500),
  carType: z.string().trim().min(1, "Vehicle type is required").max(120),
  carColor: z.string().trim().min(1, "Vehicle color is required").max(60),
  licensePlate: z.string().trim().min(1, "License plate is required").max(20),
  carYearModel: z.string().trim().min(1, "Year / model is required").max(40),
  yearsOfExperience: z.coerce.number().int().min(0).max(80),
  shiftType: driverShiftTypeSchema,
  availableFrom: timeSchema,
  availableTo: timeSchema,
  about: z.string().trim().max(5000).optional(),
  skills: z.string().trim().max(1000).optional(),
  profilePhoto: z.string().trim().url().optional().or(z.literal("")),
});

export const driverProfileFormSchema = driverProfileFormBaseSchema.extend(documentFormFields);

export const driverProfileSettingsFormSchema = driverProfileFormBaseSchema.omit({
  carType: true,
  carColor: true,
  licensePlate: true,
  carYearModel: true,
  shiftType: true,
  availableFrom: true,
  availableTo: true,
});

export const driverVehicleSettingsFormSchema = z.object({
  carType: z.string().trim().min(1, "Vehicle type is required").max(120),
  carColor: z.string().trim().min(1, "Vehicle color is required").max(60),
  licensePlate: z.string().trim().min(1, "License plate is required").max(20),
  carYearModel: z.string().trim().min(1, "Year / model is required").max(40),
  shiftType: driverShiftTypeSchema,
  availableFrom: timeSchema,
  availableTo: timeSchema,
});

export const driverDocumentsFormSchema = z.object(documentFormFields);

export type DriverProfileSettingsFormInput = z.infer<typeof driverProfileSettingsFormSchema>;
export type DriverVehicleSettingsFormInput = z.infer<typeof driverVehicleSettingsFormSchema>;
export type DriverDocumentsFormInput = z.infer<typeof driverDocumentsFormSchema>;

export type DriverProfileFormInput = z.infer<typeof driverProfileFormSchema>;
export type DriverDocumentsPayload = {
  [K in DriverDocumentField]: string;
};

export type UpdateDriverProfilePayload = Partial<
  Omit<DriverProfileFormInput, "email" | "skills" | "profilePhoto" | DriverDocumentField>
> & {
  profilePhoto?: string;
  skills?: string[];
  documents?: DriverDocumentsPayload;
};

export const DRIVER_PORTAL_EDITABLE_STATUSES = [
  "pending",
  "under_review",
  "changes_requested",
  "approved",
] as const;
