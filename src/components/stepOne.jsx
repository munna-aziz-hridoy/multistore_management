// react import
import React from "react";

// package import
import toast from "react-hot-toast";

// component import
import { Image } from ".";

// icon import
import { BsCheck } from "react-icons/bs";

// image import
import shopifyLogo from "@/assets/images/shopify_logo.png";
import wordpressLogo from "@/assets/images/wordpress_logo.png";

function StepOne({ setStep, setPlatform, platform }) {
  const handleChangeStep = () => {
    if (!platform) return toast.error("Please select a platform first");
    setStep(2);
  };

  const handleSelectPlatform = (platform) => {
    setPlatform(platform);
  };

  return (
    <div className="w-full min-h-[455px] shadow-md border-2 border-black/[0.07] rounded-md p-5 mt-12">
      <h2 className="text-base text-black/[0.84] font-semibold mb-6">
        Platform select
      </h2>
      <div className="flex justify-center items-center gap-5">
        {/* <div
          onClick={() => handleSelectPlatform("shopify")}
          className={`w-1/2 min-h-[350px] rounded-md border-2  flex justify-center items-center relative cursor-pointer ${
            platform === "shopify" ? "border-primary" : "border-black/[0.14]"
          }`}
        >
          <Image src={shopifyLogo.src} w={156} h={152} />
          {platform === "shopify" && (
            <p className="absolute top-4 right-4 text-white bg-primary rounded-full">
              <BsCheck />
            </p>
          )}
        </div> */}
        <div
          onClick={() => handleSelectPlatform("wordpress")}
          className={`w-1/2 min-h-[350px] rounded-md border-2  flex justify-center items-center relative cursor-pointer ${
            platform === "wordpress" ? "border-primary" : "border-black/[0.14]"
          }`}
        >
          <Image src={wordpressLogo.src} w={225} h={140} />
          {platform === "wordpress" && (
            <p className="absolute top-4 right-4 text-white bg-primary rounded-full">
              <BsCheck />
            </p>
          )}
        </div>
      </div>
      <button
        onClick={handleChangeStep}
        className="w-full bg-primary h-[45px] rounded-md text-white font-medium mt-6 hover:bg-primary/80 duration-100"
      >
        Next
      </button>
    </div>
  );
}

export default StepOne;
