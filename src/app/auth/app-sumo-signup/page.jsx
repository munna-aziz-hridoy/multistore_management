"use client";

// React import
import React, { useEffect, useState } from "react";

// components import
import { Loader, PasswordInput } from "@/components";

// package import
import toast from "react-hot-toast";

// firebase import
import {
  useCreateUserWithEmailAndPassword,
  useUpdateProfile,
} from "react-firebase-hooks/auth";
import { auth, firestore } from "@/firebase.init";

// utils import
import { firebaseMessageExtract } from "@/utils";
import { useRouter } from "next/navigation";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";

function AppSumoSignup() {
  // error state

  const [error, setError] = useState({
    email: { value: false, message: "" },
    password: { value: false, message: "" },
    confirm_password: { value: false, message: "" },
    terms_agree: { value: false, message: "" },
    first_name: { value: false, message: "" },
    last_name: { value: false, message: "" },
    license_key: { value: false, message: "" },
    response: {
      value: false,
      message: "",
    },
  });

  // component state

  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  // firebase hooks

  const [createUser, , , basicAuthError] =
    useCreateUserWithEmailAndPassword(auth);
  const [updateProfile] = useUpdateProfile(auth);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      email,
      first_name,
      last_name,
      password,
      confirm_password,
      license_key,
    } = e.target;

    // get data from form
    const data = {
      email: email.value,
      first_name: first_name.value,
      last_name: last_name.value,
      password: password.value,
      confirm_password: confirm_password.value,
      terms_agree: terms, // Make sure `terms` is defined correctly.
      license_key: license_key.value,
    };

    // set error to default
    setError({
      email: { value: false, message: "" },
      password: { value: false, message: "" },
      confirm_password: { value: false, message: "" },
      terms_agree: { value: false, message: "" },
      first_name: { value: false, message: "" },
      last_name: { value: false, message: "" },
      license_key: { value: false, message: "" },
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

    // password unmatched error
    if (data.password !== data.confirm_password) {
      return setError((prevError) => ({
        ...prevError,
        confirm_password: { value: true, message: "Password doesn't match" },
      }));
    }

    // agree to the terms
    if (!terms) {
      toast.error("Please agree to the terms and conditions.");
      return setError((prevError) => ({
        ...prevError,
        terms_agree: {
          value: true,
          message: "Please agree to the terms and conditions.",
        },
      }));
    }

    // Validate license key in Firestore
    const q = query(collection(firestore, "license_keys"));

    setLoading(true);
    try {
      const licenseSnapshot = await getDocs(q);
      const keys = licenseSnapshot?.docs?.map((item) => ({
        doc_id: item?.id,
        ...item.data(),
      }));

      const is_matched = keys?.find(
        (item) => item?.license_key === license_key.value
      );

      if (!is_matched) {
        setLoading(false);
        return toast.error("Invalid license key");
      }

      // Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: `${data.first_name} ${data.last_name}`,
        });

        const createdUser = await addDoc(collection(firestore, "users"), {
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          license_key: license_key.value,
        });

        // Update license key to mark it as used
        const docRef = doc(firestore, "license_keys", is_matched.doc_id);
        await updateDoc(docRef, {
          used: true,
          user_id: createdUser.id,
        });

        toast.success("Sign up successfully!");
        // Clear form fields
        email.value = "";
        first_name.value = "";
        last_name.value = "";
        password.value = "";
        confirm_password.value = "";
        license_key.value = "";
        setTerms(false);
        setLoading(false);
        router.push("/");
      }
    } catch (error) {
      console.error(error);
      toast.error("Sign up failed: " + error.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-4xl font-bold">Welcome</h2>

      <p className="text-black/[0.54] mt-2 mb-5">
        Please fill up the asking credential and license key to register as a
        new user.
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
      <div className="flex items-start gap-4 my-4">
        <div>
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            className="h-[45px] border-2 border-black/10 rounded-xl w-full py-2 px-4"
          />
          {error.first_name.value && (
            <p className="text-xs mt-1 font-semibold text-red-400 ml-2 capitalize">
              {error.first_name.message}
            </p>
          )}
        </div>
        <div>
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            className="h-[45px] border-2 border-black/10 rounded-xl w-full py-2 px-4"
          />
          {/* {error.last_name.value && (
            <p className="text-xs mt-1 font-semibold text-red-400 ml-2 capitalize">
              {error.last_name.message}
            </p>
          )} */}
        </div>
      </div>
      <PasswordInput
        placeholder="Password"
        name="password"
        error={error.password.value}
        error_message={error.password.message}
      />
      <PasswordInput
        placeholder="Confirm Password"
        name="confirm_password"
        error={error.confirm_password.value}
        error_message={error.confirm_password.message}
      />

      <input
        type="text"
        name="license_key"
        placeholder="App sumo License key"
        className="h-[45px] border-2 border-black/10 rounded-xl w-full py-2 px-4 mt-3"
      />
      {error.email.value && (
        <p className="text-xs mt-1 font-semibold text-red-400 ml-2 capitalize">
          {error.email.message}
        </p>
      )}

      <div className="flex items-center me-4 mt-4">
        <input
          id="terms_agree"
          type="checkbox"
          name="terms_agree"
          checked={terms}
          onChange={(e) => setTerms(e.target.checked)}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-xl cursor-pointer"
        />
        <label
          htmlFor="terms_agree "
          className="ms-2 text-sm font-medium text-black/[0.54]"
        >
          I agree to receive promotions
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
        {loading ? <Loader /> : "Sign up"}
      </button>
    </form>
  );
}

export default AppSumoSignup;
