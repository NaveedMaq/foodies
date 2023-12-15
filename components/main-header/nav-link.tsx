"use client";

import Link from "next/link";
import classes from "./nav-link.module.css";
import { usePathname } from "next/navigation";
import React from "react";

export interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

export default function NavLink({ href, children }: NavLinkProps) {
  const path = usePathname();

  return (
    <Link
      href={href}
      className={
        path === href || path.startsWith(href + "/")
          ? `${classes.active} ${classes.link}`
          : `${classes.link}`
      }
    >
      {children}
    </Link>
  );
}
