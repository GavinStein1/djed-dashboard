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


export default function NavbarComponent() {
    return (
    <Navbar>
      <NavbarBrand>
        <h1>DJED Dash</h1>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="#">
            Current
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link href="/historical">
            Historical
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <Button as={Link} color="primary" href="#" variant="flat">
            Download
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
    )
}