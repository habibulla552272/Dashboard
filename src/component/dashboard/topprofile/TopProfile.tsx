"use client";
import { useSession } from "next-auth/react";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";

const TopProfile = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className="relative py-10 mr-8">
      <Dialog>
        <DialogTrigger asChild>
          {!session ? (
            <button className="text-white">Hey bro</button>
          ) : (
            <div className="flex items-center gap-4 cursor-pointer">
              <Image
                src={session.user?.image || ""}
                alt="Profile"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full border"
              />
              <h1 className="text-xl font-semibold">
                {session.user?.name || "User"}{" "}
                <span className="text-red-400 text-xs">(admin)</span>
              </h1>
            </div>
          )}
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Profile Details</DialogTitle>
            <DialogDescription>
              {!session ? (
                <p>Not logged in</p>
              ) : (
                <div className="space-y-2 text-black">
                  <p>
                    <strong>Name:</strong> {session.user?.name}
                  </p>
                  {/** Only show if role exists */}
                  {session.user?.role && (
                    <p>
                      <strong>Role:</strong> {session.user.role}
                    </p>
                  )}
                  <p>
                    <strong>Email:</strong> {session.user?.email}
                  </p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TopProfile;
