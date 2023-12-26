"use client";

// react import
import React, { useContext } from "react";

// context import
import { ShopContext, SidebarContext } from "@/context";

// icon import
import {
  MdStoreMallDirectory,
  MdOutlineStoreMallDirectory,
} from "react-icons/md";

// next import
import Link from "next/link";
import { usePathname } from "next/navigation";

function SidebarItem({ name, shop }) {
  // context

  const { collapse, delay } = useContext(SidebarContext);
  const { setShop } = useContext(ShopContext);

  // next hooks

  const pathname = usePathname();

  return (
    <Link href={`${shop?.url}`}>
      <div
        onClick={() => setShop(shop)}
        className={`flex items-center gap-3 text-[15px] w-full h-[50px] ${
          collapse ? "p-[15px]" : "p-[25px]"
        }  cursor-pointer ${
          pathname === shop?.url
            ? "font-semibold bg-white/[0.05] border-l-4 border-[#D1E4FF] text-[#D1E4FF]"
            : "bg-transparent border-l-4 border-transparent text-white/[0.54]"
        }`}
      >
        {pathname === shop?.url ? (
          <MdStoreMallDirectory fontSize={22} />
        ) : (
          <MdOutlineStoreMallDirectory fontSize={22} />
        )}
        {!collapse && delay && <p>{name}</p>}
      </div>
    </Link>
  );
}

export default SidebarItem;
