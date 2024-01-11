"use client"

import {  
    Navbar,
    NavbarBrand,   
    NavbarContent,   
    NavbarItem,   
    NavbarMenuToggle,  
    NavbarMenu,  
    NavbarMenuItem
  } from "@nextui-org/react";
import Link from "next/link";
import { Button } from "@nextui-org/react";
import { useEffect, useState} from "react";


export default function NavbarComponent() {
  const [pathname, setPathname] = useState("");
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tmp_pathname = window.location.pathname;
      setPathname(tmp_pathname);
    }
  })
  
  return (
  <Navbar className="">
    <NavbarBrand>
      <h1 className="foreground-color">DJED Dashboard</h1>
    </NavbarBrand>
    <NavbarContent className="hidden sm:flex gap-4 foreground-color" justify="center">
      <NavbarItem isActive={(pathname !== "/")}>
        <Link href="/">
          Overview
        </Link>
      </NavbarItem>
      <NavbarItem isActive={(pathname !== "/historical")}>
        <Link href="/historical">
          Historical
        </Link>
      </NavbarItem>
    </NavbarContent>
    <NavbarContent justify="end">
      <NavbarItem>
        <Button as={Link} className="white color-background" href="#" variant="flat">
          Download data
        </Button>
      </NavbarItem>
    </NavbarContent>
  </Navbar>
  )
}