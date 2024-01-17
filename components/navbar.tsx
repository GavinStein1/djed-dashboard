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
// import Link from "next/link";
import { Button, Link } from "@nextui-org/react";
import { useEffect, useState} from "react";


export default function NavbarComponent() {
  const [pathname, setPathname] = useState("");
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    "Home",
    "Historical",
    "About",
    "Whitepaper"
  ]

  const menuItemsHref = [
    "/",
    "/historical",
    "/about",
    "https://eprint.iacr.org/2021/1069.pdf"
  ]

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tmp_pathname = window.location.pathname;
      setPathname(tmp_pathname);
    }
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    handleResize();

    // Listen for window resize events
    window.addEventListener('resize', handleResize);
    setIsMenuOpen(false);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <Navbar onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link href="/">
            <h1 className="">DJED Dashboard</h1>
          </Link>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem isActive={(pathname === "/")}>
          <Link href="/">
            Overview
          </Link>
        </NavbarItem>
        <NavbarItem isActive={(pathname === "/historical")}>
          <Link href="/historical">
            Historical
          </Link>
        </NavbarItem>
        <NavbarItem className="primary-color" isActive={(pathname === "/djed-whitepaper")}>
          <a href="https://eprint.iacr.org/2021/1069.pdf" target="_blank" rel="noopener noreferrer">
            Djed Whitepaper
          </a>
        </NavbarItem>
        <NavbarItem isActive={(pathname === "/about")}>
          <Link href="/about">
            About
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <Button variant="solid" className="primary-color" onClick={downloadJsonData}>
            Download data
          </Button>
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            {item === "Whitepaper" ? (
              <a href="https://eprint.iacr.org/2021/1069.pdf" target="_blank" rel="noopener noreferrer">
                <p className="primary-color menu-item-font">Djed Whitepaper</p>
              </a>
            ) : (
              <Link
                color={
                  "primary"
                }
                className="w-full"
                href={menuItemsHref[index]}
                >
                {item}
              </Link>
            )}
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  )
}

async function downloadJsonData() {
  // Get data from DB
  const response = await fetch("https://djed-dash-default-rtdb.asia-southeast1.firebasedatabase.app/raw_data.json");

  if (response.status != 200) {
    return;
  }

  const jsonData = await response.json();
  // Convert JSON to string
  const jsonString = JSON.stringify(jsonData, null, 2);

  // Create a Blob with the JSON data
  const blob = new Blob([jsonString], { type: 'application/json' });

  // Create a download link
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = "Djed_Dashboard_Raw_Data.json";

  // Append the link to the body
  document.body.appendChild(downloadLink);

  // Trigger the download
  downloadLink.click();

  // Remove the link from the body
  document.body.removeChild(downloadLink);
}