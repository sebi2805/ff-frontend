"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import { deleteCookie } from "../../utils/cookies";
import { useRouter } from "next/navigation";

const navLinks = [
  { label: "Home", href: "/home" },
  { label: "Rewards", href: "/home/rewards" },
  { label: "Settings", href: "/home/settings" },
  { label: "Info", href: "/home/info" },
];

const Navbar = () => {
  const [navOpen, setNavOpen] = useState(false);
  const router = useRouter();

  const logout = () => {
    deleteCookie("access-token");
    router.push("/login");
  };
  return (
    <nav className="bg-black-lighter text-white fixed w-full top-0 z-10">
      <div className="flex items-center justify-between px-4 py-2">
        {/* Logo */}
        <Link href="/home" passHref className="flex items-center">
          <div className="relative w-12 h-12">
            <Image
              src="/logo_4.png"
              alt="FitFlow Logo"
              layout="fill"
              objectFit="cover"
            />
          </div>
          <span className="ml-2 font-bold text-xl">FitFlow</span>
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex space-x-4">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link href={link.href} className="hover:text-purple-200">
                {link.label}
              </Link>
            </li>
          ))}
          <li onClick={logout} className="hover:text-purple-200">
            Logout
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setNavOpen(!navOpen)} type="button">
            {navOpen ? (
              <XIcon className="h-6 w-6 text-white" />
            ) : (
              <MenuIcon className="h-6 w-6 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Links */}
      {navOpen && (
        <ul className="md:hidden px-4 pt-2 pb-4 space-y-1 bg-purple-700">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="block text-white hover:text-purple-200"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
