"use client";

// react import
import React, { useState } from "react";

// icon import
import { LuEye, LuEyeOff } from "react-icons/lu";

function PasswordInput({
  name = "password",
  onChange = () => {},
  placeholder = "Password",
  error = false,
  error_message = "",
}) {
  const [showPass, setShowPass] = useState(false);

  const handleShowPass = (e) => {
    setShowPass((prev) => !prev);
  };

  return (
    <div>
      <div className="h-[45px] border-2 border-black/10 rounded-xl w-full mt-4 flex justify-center items-center">
        <input
          type={showPass ? "text" : "password"}
          name={name}
          onChange={onChange}
          placeholder={placeholder}
          className="w-[calc(100%-50px)] h-full py-2 px-4 rounded-xl"
        />
        <button
          type="button"
          onClick={handleShowPass}
          className="w-[50px] h-full text-black/[0.34] flex justify-center items-center"
        >
          {showPass ? <LuEye fontSize={24} /> : <LuEyeOff fontSize={24} />}
        </button>
      </div>
      {error && (
        <p className="text-xs mt-1 font-semibold text-red-400 ml-2 capitalize">
          {error_message}
        </p>
      )}
    </div>
  );
}

export default PasswordInput;
