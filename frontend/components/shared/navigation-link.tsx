"use client";

import { useSelectedLayoutSegment } from "next/navigation";
import { ComponentProps, FC } from "react";
import { Link } from "@/i18n/routing";

export const NavigationLink: FC<ComponentProps<typeof Link>> = (props) => {
  const { href, ...rest } = props;
  const selectedLayoutSegment = useSelectedLayoutSegment();
  const pathname = selectedLayoutSegment ? `/${selectedLayoutSegment}` : "/";
  const isActive = pathname === href;

  return (
    <Link
      aria-current={isActive ? "page" : undefined}
      className="flex h-[48px] grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium md:flex-none md:justify-start md:p-2 md:px-3"
      href={href}
      {...rest}
    />
  );
};
