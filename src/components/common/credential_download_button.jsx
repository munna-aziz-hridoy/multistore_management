// components/JumpingButton.js
import React from "react";

const DownloadCredential = () => {
  // Function to handle file download
  const handleDownload = () => {
    const fileContent =
      "Shop Name: Perfume shop (or anything you want)\nWebsite Url: https://divine-creek-71919.wp1.site\nck: ck_2cf885aa98dfb350c6f960fb13dea8535ef4d62e\ncs: cs_564d8d850bf61ea8f4f757a2570ce47642b7ec9f\n\n\nElectro Site (or anything you want)\nWebsite Url: https://wordpress-1206176-4540804.cloudwaysapps.com\nck: ck_c60595ded104244848ca86c6522e12dca9d55f35\ncs: cs_38f5768d7b8b190a6c127ca084a1541c12125438\n\n\n";
    const blob = new Blob([fileContent], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "credential.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleDownload}
      className="text-primary -mt-10 animate-bounce font-semibold"
    >
      Demo Credentials
    </button>
  );
};

export default DownloadCredential;
