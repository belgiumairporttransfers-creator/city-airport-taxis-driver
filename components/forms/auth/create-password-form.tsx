"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { SiteLogo } from "@/components/svg";
import { Form } from "@/components/ui/form";
import { createPasswordSchema, type CreatePasswordSchema } from "@/lib/schemas";
import { useAuthSetPassword } from "@/hooks/queries/use-auth";
import toast from "react-hot-toast";

const CreatePasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";
  const { mutate: setPassword, isPending } = useAuthSetPassword();

  const form = useForm<CreatePasswordSchema>({
    resolver: zodResolver(createPasswordSchema),
    mode: "onSubmit",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: CreatePasswordSchema) => {
    if (!token) {
      toast.error("Password setup link is invalid or expired. Contact support for a new link.");
      return;
    }

    setPassword(
      {
        token,
        password: values.password,
      },
      {
        onSuccess: () => {
          const loginUrl = email
            ? `/auth/login?email=${encodeURIComponent(email)}`
            : "/auth/login";
          router.push(loginUrl);
        },
      }
    );
  };

  return (
    <div className="w-full">
      <Link href="/auth/login" className="inline-block">
        <SiteLogo className="h-10 w-10 2xl:h-14 2xl:w-14 text-primary" />
      </Link>
      <div className="2xl:mt-8 mt-6 2xl:text-3xl text-2xl font-bold text-default-900">
        Set Your Password
      </div>
      <div className="2xl:text-lg text-base text-default-600 mt-2 leading-6">
        {email ? (
          <>
            Your application was approved. Create a password for{" "}
            <span className="font-medium text-default-900">{email}</span>.
          </>
        ) : (
          "Your application was approved. Create a password to access the driver portal."
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="2xl:mt-7 mt-8">
          <Input name="password" label="New Password" type="password" />
          <Input
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            className="mt-6"
          />

          <Button className="w-full mt-8" isLoading={isPending} loadingText="Saving password...">
            Set Password
          </Button>
        </form>
      </Form>

      <div className="mt-6 text-center text-base text-default-600">
        Already set your password?{" "}
        <Link href="/auth/login" className="text-primary">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default CreatePasswordForm;
