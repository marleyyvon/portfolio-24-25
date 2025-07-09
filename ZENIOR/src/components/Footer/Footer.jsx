"use client";

import { FaGithub } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const CustomFooter = () => {
  return (
    <footer className="bg-[#b30738] text-white py-4">
      <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row items-center justify-between px-4">
        {/* Logo Section */}
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/images/square-whitetree-nobg.png"
              alt="Zenior Logo"
              width={30}
              height={30}
            />
            <span className="text-2xl font-semibold">Zenior</span>
          </Link>
        </div>

        {/* Footer Links */}
        <div className="flex items-center space-x-4">
          <Link href="/about">
            <Button
              variant="ghost"
              className="hover:text-[#9e1b32] transition-colors text-base font-medium"
            >
              About
            </Button>
          </Link>
          <Link href="/privacy-policy">
            <Button
              variant="ghost"
              className="hover:text-[#9e1b32] transition-colors text-base font-medium"
            >
              Privacy Policy
            </Button>
          </Link>
          <a
            href="https://github.com/CSEN-SCU/csen-174-f24-project-zenior"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="ghost"
              size="icon"
              className="hover:text-[#9e1b32] hover:border-[#9e1b32] transition-colors"
            >
              <FaGithub className="text-xl" />
            </Button>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default CustomFooter;
