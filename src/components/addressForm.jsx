import React, { useEffect, useState } from "react";

function AddressForm({ name, setCurrentOrder, prevAddress, closeModal }) {
  const [address, setaddress] = useState({
    first_name: "",
    last_name: "",
    address_1: "",
    address_2: "",
    city: "",
    state: "",
    postcode: "",
    country: "",
    email: "",
    phone: "",
    company: "",
  });

  useEffect(() => {
    if (prevAddress) {
      setaddress(prevAddress);
    }
  }, [prevAddress]);

  const handleSubmit = () => {
    setCurrentOrder((prev) => ({
      ...prev,
      [name]: address,
    }));
    closeModal();
  };

  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold text-black/70 capitalize">
        Change {name} Address
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 py-3 mt-8">
        {Object.keys(address).map((key, index) => (
          <div
            key={index}
            className="w-full h-[45px] rounded border border-[#B2BCCA] relative"
          >
            <span className="inline-block absolute -top-3 left-3 text-sm text-black/[0.34] bg-white px-2 capitalize">
              {key.replace("_", " ")}
            </span>
            <input
              className="rounded w-full h-full px-4 text-black/[0.84] font-semibold"
              placeholder={key.replace("_", " ")}
              name={key}
              value={address[key]}
              onChange={(e) => {
                setaddress((prev) => ({
                  ...prev,
                  [key]: e.target.value,
                }));
              }}
            />
          </div>
        ))}

        <button
          onClick={handleSubmit}
          className="w-full bg-primary h-[45px] rounded text-white font-semibold"
        >
          Change
        </button>
      </div>
    </div>
  );
}

export default AddressForm;
