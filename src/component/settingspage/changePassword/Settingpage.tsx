"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Lock } from "lucide-react"; // <-- import Lock icon
import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const SettingPage = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify(passwordData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to change password");
      toast.success("Password changed successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      if (err instanceof Error) toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="cursor-pointer">
      <CardHeader className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Lock className="h-5 w-5 text-gray-600" />
          <div>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your password</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Label>Current Password</Label>
          <Input
            type="password"
            value={passwordData.currentPassword}
            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
          />
          <Label>New Password</Label>
          <Input
            type="password"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
          />
          <Label>Confirm Password</Label>
          <Input
            type="password"
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Changing..." : "Change Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SettingPage;
