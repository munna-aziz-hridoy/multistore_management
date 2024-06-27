"use client";

// react import
import React, { useEffect, useState } from "react";

// next import
import Link from "next/link";

// components import
import { Loader, PasswordInput } from "@/components";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/firebase.init";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { firebaseMessageExtract } from "@/utils";

function Signin() {
  // error state

  const [error, setError] = useState({
    email: { value: false, message: "" },
    password: { value: false, message: "" },
    response: {
      value: false,
      message: "",
    },
  });

  // component state

  const [loading, setLoading] = useState(false);

  // firebase hooks

  const [signIn, , , basicAuthError] = useSignInWithEmailAndPassword(auth);

  // next hooks

  const router = useRouter();

  // read error change effect

  useEffect(() => {
    if (basicAuthError) {
      setError((prevError) => ({
        ...prevError,
        response: {
          value: true,
          message: firebaseMessageExtract(basicAuthError.message),
        },
      }));
    }
  }, [basicAuthError]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const { email, password } = e.target;

    // get data from form

    const data = {
      email: email.value,
      password: password.value,
    };

    // set error to default

    setError({
      email: { value: false, message: "" },
      password: { value: false, message: "" },
      response: {
        value: false,
        message: "",
      },
    });

    // set error if data not found

    Object.keys(data).forEach((key) => {
      if (!data[key]) {
        setError((prevError) => ({
          ...prevError,
          [key]: {
            value: true,
            message: `${key?.split("_").join(" ")} is required`,
          },
        }));
      }
    });

    if (!Object.values(error).some((e) => e.value)) {
      setLoading(true);
      signIn(data.email, data.password)
        .then((userCredential) => {
          const user = userCredential?.user;
          setLoading(false);
          if (user) {
            toast.success("Sign in successfully!");
            email.value = "";
            password.value = "";
            setLoading(false);
            router.push("/");
          }
        })
        .catch((err) => {
          setLoading(false);
        });
    } else return;
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-4xl font-bold">Welcome back</h2>
      <p className="text-black/[0.54] mt-2 mb-5">
        Please fill up the asking credential to login.
      </p>
      <input
        type="email"
        name="email"
        placeholder="Email"
        className="h-[45px] border-2 border-black/10 rounded-xl w-full py-2 px-4"
      />
      {error.email.value && (
        <p className="text-xs mt-1 font-semibold text-red-400 ml-2 capitalize">
          {error.email.message}
        </p>
      )}

      <PasswordInput
        error={error.password.value}
        error_message={error.password.message}
        placeholder="Password"
        name="password"
      />

      <div className="flex justify-between items-center">
        <div />
        <Link href="/" className="text-primary font-semibold text-sm">
          Forgot password?
        </Link>
      </div>

      <div className="flex items-center me-4">
        <input
          id="save_info"
          type="checkbox"
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-xl cursor-pointer"
        />
        <label
          htmlFor="save_info"
          className="ms-2 text-sm font-medium text-black/[0.54]"
        >
          Save my informations
        </label>
      </div>

      {error.response.value && (
        <p className="text-xs mt-2 font-semibold text-red-400  capitalize text-center">
          {error.response.message}
        </p>
      )}

      <button
        disabled={loading}
        type="submit"
        className="w-full h-[45px] bg-primary border-2 border-white/30 rounded-xl flex justify-center items-center gap-4 text-white font-semibold mt-4 disabled:bg-gray-300"
      >
        {loading ? <Loader /> : "Sign in"}
      </button>
    </form>
  );
}

export default Signin;
