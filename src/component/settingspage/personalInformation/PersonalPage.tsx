"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { User, ChevronRight } from "lucide-react";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}



const PersonalPage = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (session?.accessToken) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      })
        .then(res => res.json())
        .then((data: PersonalInfo) => setPersonalInfo(data))
        .catch(err => console.error(err));
    }
  }, [session?.accessToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify(personalInfo),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update");
      toast.success("Personal info updated successfully!");
    } catch (err) {
      if (err instanceof Error) toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card  className="cursor-pointer">
      <CardHeader className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <User className="h-5 w-5 text-gray-600" />
          <div>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </div>
        </div>
   
      </CardHeader>


        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>First Name</Label>
                <Input
                  value={personalInfo.firstName}
                  onChange={e => setPersonalInfo({ ...personalInfo, firstName: e.target.value })}
                />
              </div>
              <div>
                <Label>Last Name</Label>
                <Input
                  value={personalInfo.lastName}
                  onChange={e => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
                />
              </div>
            </div>
            <Label>Email</Label>
            <Input
              type="email"
              value={personalInfo.email}
              onChange={e => setPersonalInfo({ ...personalInfo, email: e.target.value })}
            />
            <Label>Phone</Label>
            <Input
              value={personalInfo.phone}
              onChange={e => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update"}
            </Button>
          </form>
        </CardContent>

    </Card>
  );
};

export default PersonalPage;
