"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { User } from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchUserProfile, updatePersonal } from "@/lib/api";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

/* ------------------ Zod Schema ------------------ */
const personalSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  avatar: z.string().optional(),
});

type PersonalFormValues = z.infer<typeof personalSchema>;

interface UserProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  country?: string;
  cityOrState?: string;
  avatar?: string;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
}

const PersonalPage = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  // Fetch profile
  const { data: user } = useQuery<ApiResponse<UserProfile>>({
    queryKey: ["userdata"],
    queryFn: fetchUserProfile,
  });

  const userData = user?.data;

  // Initialize form directly with userData
  const {
    register,
    handleSubmit,
    watch,
    setValue,
  } = useForm<PersonalFormValues>({
    resolver: zodResolver(personalSchema),
    values: {
      firstName: userData?.firstName || "",
      lastName: userData?.lastName || "",
      email: userData?.email || "",
      phone: userData?.phone || "",
      country: userData?.country || "",
      city: userData?.cityOrState || "",
      avatar: userData?.avatar || session?.user?.image || "",
    },
  });

  const personalMutation = useMutation({
    mutationFn: ({ data, image }: { data: PersonalFormValues; image?: File }) =>
      updatePersonal(data, image),
  });

  const handleSubmitForm = async (values: PersonalFormValues) => {
    setLoading(true);
    try {
      await personalMutation.mutateAsync({ data: values });
      toast.success("Personal info updated successfully!");
    } catch (err) {
      if (err instanceof Error) toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = () => {
    const fileInput = document.getElementById(
      "avatarInput"
    ) as HTMLInputElement | null;
    fileInput?.click();
  };

  const handleAvatarChange = async (file: File) => {
    setLoading(true);
    try {
      const values = {
        firstName: watch("firstName"),
        lastName: watch("lastName"),
        email: watch("email"),
        phone: watch("phone"),
        country: watch("country"),
        city: watch("city"),
        avatar: watch("avatar"),
      };
      await personalMutation.mutateAsync({ data: values, image: file });

      setValue("avatar", URL.createObjectURL(file));
      toast.success("Avatar updated successfully!");
    } catch (err) {
      if (err instanceof Error) toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Update your personal details</CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit(handleSubmitForm)}
          className="flex flex-col md:flex-row gap-8"
        >
          {/* Left side */}
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>First Name</Label>
                <Input {...register("firstName")} />
              </div>
              <div>
                <Label>Last Name</Label>
                <Input {...register("lastName")} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Email Address</Label>
                <Input type="email" {...register("email")} />
              </div>
              <div>
                <Label>Phone</Label>
                <Input {...register("phone")} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Country</Label>
                <Input {...register("country")} />
              </div>
              <div>
                <Label>City/State</Label>
                <Input {...register("city")} />
              </div>
            </div>

            <Button type="submit" className="mt-4 w-32" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>

          {/* Right side */}
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center mb-4">
              {watch("avatar") ? (
                <Image
                  src={watch("avatar") || ""}
                  alt="Avatar"
                  width={128}
                  height={128}
                  className="object-cover"
                />
              ) : (
                <User className="w-16 h-16 text-gray-400" />
              )}
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-32"
              onClick={handleUpdateProfile}
              disabled={loading}
            >
              Edit Image
            </Button>
            <p className="mt-2 font-semibold">
              {watch("firstName")} {watch("lastName")}
            </p>

            <input
              type="file"
              accept="image/*"
              id="avatarInput"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleAvatarChange(file);
              }}
            />
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PersonalPage;
