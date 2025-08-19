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

const TopProfile: React.FC = () => {
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
                src={session.user?.image || "/default-profile.png"}
                alt="Profile"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full border"
              />
              <h1 className="text-xl font-semibold">
                {session.user?.name || "User"}{" "}
                {session.user?.role && (
                  <span className="text-red-400 text-xs">({session.user.role})</span>
                )}
              </h1>
            </div>
          )}
        </DialogTrigger>

        <DialogContent className="absolute top-[27%] left-[85%]">
          <DialogHeader>
            <DialogTitle>Profile Details</DialogTitle>
            {session ? (
              <div className="space-y-2 text-black">
                <div>
                  <strong>Name:</strong> {session.user?.name}
                </div>
                {session.user?.role && (
                  <div>
                    <strong>Role:</strong> {session.user.role}
                  </div>
                )}
                <div>
                  <strong>Email:</strong> {session.user?.email}
                </div>
              </div>
            ) : (
              <DialogDescription>Not logged in</DialogDescription>
            )}
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TopProfile;
