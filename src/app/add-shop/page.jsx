"use client";

// react import
import React, { useState } from "react";

// package import
import toast from "react-hot-toast";

// icon import

// component import
import { StepOne, StepTwo } from "@/components";

function AddShop() {
  const [step, setStep] = useState(1);
  const [platform, setPlatform] = useState(null);

  const handleChangeStep = () => {
    setStep((prev) => {
      if (prev === 1) {
        if (!platform) {
          toast.error("Please select a platform first");
          return 1;
        }
        return 2;
      } else {
        return 1;
      }
    });
  };

  return (
    <div>
      <div>
        <p className="text-primary uppercase font-semibold text-sm">
          step {step}
        </p>
        <div
          onClick={handleChangeStep}
          className="w-full h-[6px] rounded-3xl bg-[#EBEBEB] my-2 relative cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`bg-primary absolute  h-full w-1/2 rounded-3xl cursor-default ${
              step === 1 ? "left-0" : "right-0"
            }`}
          />
        </div>
      </div>
      {step === 1 && (
        <StepOne
          setPlatform={setPlatform}
          setStep={setStep}
          platform={platform}
        />
      )}
      {step === 2 && <StepTwo setStep={setStep} platform={platform} />}
    </div>
  );
}

export default AddShop;
