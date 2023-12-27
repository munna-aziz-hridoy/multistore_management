// react import
import React from "react";

// next import
import Image from "next/image";

function Imgs({ w, h, src, circle = false, bg = "" }) {
  return (
    <div
      className={`relative`}
      style={{
        width: w ? w : "100%",
        height: h ? h : "100%",
        borderRadius: circle ? "50%" : "0",
        background: bg,
        overflow: "hidden",
      }}
    >
      <Image layout="fill" src={src} alt="images" />
    </div>
  );
}

export default Imgs;
