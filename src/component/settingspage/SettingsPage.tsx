"use client";

import { useState } from "react";
import PersonalPage from "./personalInformation/PersonalPage";
import ChangePasswordPage from "./changePassword/ChangePasswordpage";

export function SettingsPage() {
  const [showpersonal, setShowpersonal] = useState(false);
  const [showperChange, setShowprChange] = useState(false);

  const handelPersonalForm = () => {
    setShowprChange(false);
    setShowpersonal(!showpersonal);
  };
  const handelChangeSetting = () => {
    setShowpersonal(false);
    setShowprChange(!showperChange);
  };
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Settings</h1>
      <p className="text-sm text-gray-500 mb-6">Dashboard &gt; Settings</p>

      <div
        className={`flex  flex-col justify-start items-start  text-xl font-bold w-64`}
      >
        <button
          className=" border-b-1 pb-5"
          onClick={() => handelPersonalForm()}
        >
          Personal Information
        </button>
        <button className="pt-5" onClick={() => handelChangeSetting()}>
          Change Password
        </button>
      </div>
      {/* Personal Information */}
      <div className={`${showpersonal ? "block" : "hidden"}`}>
        <PersonalPage />
      </div>

      {/* Change Password */}
      <div className={`${showperChange ? "block" : "hidden"}`}>
        <ChangePasswordPage />
      </div>
    </div>
  );
}

export default SettingsPage;
