"use client";

// react import
import React, { useContext, useState } from "react";

// firebase import
import { useUpdatePassword, useDeleteUser } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/firebase.init";
import { deleteDoc, doc } from "firebase/firestore";

// icon import
import lockIcon from "@/assets/images/lock.png";
import { IoMdArrowDropright } from "react-icons/io";

// package
import toast from "react-hot-toast";

// others
import { Image, Loader, Modal } from "@/components";
import { ShopContext, UserContext } from "@/context";

function PasswordChange({ onClose }) {
  const [newPass, setNewPass] = useState("");

  const [updatePassword, updating, error] = useUpdatePassword(auth);

  function handleChangePassword() {
    // Handle the change password logic here

    if (newPass) {
      updatePassword(newPass).then((success) => {
        if (success) {
          setNewPass("");
          onClose();
          toast.success("Password changed successfully");
        } else {
          toast.error("Password changing failed");
        }
      });
    } else {
      toast.error("Please enter new password");
    }
  }

  return (
    <Modal closeModal={onClose}>
      <div className="w-[500px] h-[200px] py-3 px-4">
        <p className="text-lg font-semibold text-black/[0.84] text-center">
          Change password
        </p>
        <p className=" text-black/[0.84]">New Pasword</p>
        <div className="w-full rounded-2xl bg-[#F5F5F5] py-1 px-4 mt-2">
          <input
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            className="w-full bg-[#F5F5F5] h-[45px] rounded"
          />
        </div>
        <button
          onClick={handleChangePassword}
          disabled={!newPass || updating}
          className="w-full h-[45px] rounded-lg bg-primary text-white font-semibold mt-4 disabled:bg-gray-500"
        >
          {updating ? (
            <div className="flex justify-center items-center">
              <Loader />
            </div>
          ) : (
            "Save"
          )}
        </button>
      </div>
    </Modal>
  );
}

function Setting() {
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [deleteUser, deleting] = useDeleteUser(auth);

  const { db_id, sites } = useContext(UserContext);

  function deleteAccount() {
    const confirm = window.confirm(
      "Are you sure you want to delete your account?"
    );

    if (confirm) {
      deleteUser().then((success) => {
        if (success) {
          toast.success("Account deleted successfully");
          window.location.reload();
          return;
        } else {
          toast.error(
            "Account deleting failed, please re-login to perform the action"
          );
        }
      });
    }

    // let siteDone = false;
    // let userDone = false;
    // let accountDone = false;

    // if (confirm) {
    //   setLoading(true);

    //   if (sites?.length) {
    //     sites.forEach((site) => {
    //       siteDone = false;
    //       const shopDocRef = doc(firestore, "shops", site);
    //       deleteDoc(shopDocRef)
    //         .then(() => {
    //           siteDone = true;
    //         })
    //         .catch((error) => {
    //           setLoading(false);
    //         });
    //     });
    //   } else {
    //     siteDone = true;
    //   }

    //   const userDocRef = doc(firestore, "users", db_id);

    //   if (db_id) {
    //     deleteDoc(userDocRef)
    //       .then(() => {
    //         userDone = true;

    //         deleteUser()
    //           .then((success) => {
    //             if (success) {
    //               accountDone = true;
    //               toast.success("Account deleted successfully");
    //               window.location.reload();
    //               return;
    //             }
    //           })
    //           .catch((error) => {
    //             setLoading(false);
    //           });
    //       })
    //       .catch((error) => {
    //         setLoading(false);
    //       });
    //   } else {
    //     userDone = true;
    //     deleteUser()
    //       .then((success) => {
    //         if (success) {
    //           accountDone = true;
    //           toast.success("Account deleted successfully");
    //           window.location.reload();
    //           return;
    //         }
    //       })
    //       .catch((error) => {
    //         setLoading(false);
    //       });
    //   }
    // }

    // if (siteDone && userDone && accountDone) {
    //   setLoading(false);
    // }
  }

  return (
    <div>
      <div className="min-w-[300px] w-1/3  bg-[#f5f5f5] opacity-90 rounded-lg flex flex-col items-center justify-start p-5 gap-5 shadow relative">
        <div
          onClick={() => setOpenModal(true)}
          className="w-full rounded-xl h-[67px] bg-white px-4 flex items-center justify-between gap-3 cursor-pointer"
        >
          <div className="flex items-center justify-start gap-3">
            <Image w={35} h={35} circle src={lockIcon.src} alt="lock" />
            <p className="text-black/[0.84] text-lg font-semibold">
              Change Password
            </p>
          </div>
          <IoMdArrowDropright className="text-black/[0.54]" />
        </div>
        <button
          onClick={deleteAccount}
          className="w-[200px] h-[45px] rounded-xl text-white font-semibold bg-[#f74747] px-3 mr-auto"
        >
          {deleting ? (
            <div className="flex justify-center items-center">
              <Loader />
            </div>
          ) : (
            "Delete Account"
          )}
        </button>
      </div>
      {openModal && <PasswordChange onClose={() => setOpenModal(false)} />}
    </div>
  );
}

export default Setting;
