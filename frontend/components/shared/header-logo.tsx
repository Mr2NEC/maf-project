"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { Link } from "@/i18n/routing";

export const HeaderLogo = () => {
  const { theme } = useTheme();
  return (
    <Link href="/">
      <Image
        src={theme === "light" ? "/logo.png" : "/logo-w.png"}
        alt="Maf Logo"
        width={60}
        height={40}
      />
    </Link>
  );
};
