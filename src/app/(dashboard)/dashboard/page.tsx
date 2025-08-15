"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardContent } from "@/component/dashboardContent/dashboard-content";
import { Dashboard } from "@/component/dashboard/Dashboard";

export default function DashboardPage() {
  // const { data: session, status } = useSession();
  // const router = useRouter();

  // useEffect(() => {
  //   if (status === "unauthenticated") {
  //     router.push("/login");
  //   }
  // }, [status, router]);

  // if (status === "loading") {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen bg-gray-50">
  //       <motion.p
  //         className="text-lg font-medium text-gray-700"
  //         animate={{ opacity: [0.3, 1, 0.3] }}
  //         transition={{ duration: 1.5, repeat: Infinity }}
  //       >
  //         Loading...
  //       </motion.p>
  //     </div>
  //   );
  // }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      {/* <motion.div
        className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.img
          src={`https://ui-avatars.com/api/?name=${session?.user?.name}&background=random`}
          alt="User Avatar"
          className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-indigo-200"
          whileHover={{ scale: 1.05 }}
        />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Welcome, {session?.user?.name}!
        </h1>
        <p className="text-gray-600 mb-1">
          <span className="font-semibold">Email:</span> {session?.user?.email}
        </p>
        <p className="text-gray-600">
          <span className="font-semibold">Role:</span> {session?.user?.role}
        </p>
        <motion.button
          onClick={() => router.push("/")}
          className="mt-6 w-full bg-indigo-500 text-white py-2 rounded-lg shadow hover:bg-indigo-600 focus:outline-none"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Go to Home
        </motion.button>
      </motion.div> */}
         
         <Dashboard />
      
    </div>
  );
}