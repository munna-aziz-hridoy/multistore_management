// react import
import React from "react";

function Divider({ text }) {
  return (
    <div className="w-full h-[2px] bg-gray-200 my-7 relative">
      <span className="absolute left-1/2 -translate-x-1/2 -top-2 inline-block bg-white px-3 text-black/60">
        {text}
      </span>
    </div>
  );
}

export default Divider;
