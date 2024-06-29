"use client";

import { faWallet } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import React, { useState } from "react";
import { useAccount } from "wagmi";

export default function Navbar() {
  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#09090b] shadow-md fixed w-full z-40 top-0 bg-opacity-90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a
              href="/"
              className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400 shadow-lg transition duration-300 ease-in-out hover:from-green-400 hover:to-blue-400"
            >
              Nextbook
            </a>
          </div>
          <div className="hidden md:block">
            <div className="flex justify-center md:justify-end md:col-span-1">
              <button
                onClick={!address ? openConnectModal : undefined}
                className="relative !w-full flex items-center justify-center w-full md:w-auto bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 text-white py-2 px-6 rounded-2xl shadow-md hover:from-blue-500 hover:via-purple-600 hover:to-pink-500 transition duration-300 ease-in-out transform hover:scale-105"
              >
                <FontAwesomeIcon
                  icon={faWallet}
                  className="mr-2"
                  style={{ width: 24 }}
                />
                {!address ? (
                  "Login"
                ) : (
                  <p className="truncate w-36 text-ellipsis">{address}</p>
                )}
              </button>
            </div>
            {/* <div className="ml-10 flex items-baseline space-x-4">
              <button
                className="relative !w-full flex items-center justify-center gap-x-1.5 w-full md:w-auto bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 text-white py-2 px-6 rounded-2xl shadow-md hover:from-blue-500 hover:via-purple-600 hover:to-pink-500 transition duration-300 ease-in-out transform hover:scale-105"
                onClick={!address ? openConnectModal : undefined}
              >
                {!address ? (
                  "Login"
                ) : (
                  <p className="truncate w-36 text-ellipsis">{address}</p>
                )}
              </button>
            </div> */}
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`md:hidden ${isOpen ? "block" : "hidden"}`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <a
            href="#"
            className="text-white hover:text-blue-500 block px-3 py-2 rounded-md text-base font-medium transition duration-300"
          >
            Anasayfa
          </a>
          <a
            href="#"
            className="text-white hover:text-blue-500 block px-3 py-2 rounded-md text-base font-medium transition duration-300"
          >
            Hakkında
          </a>
          <a
            href="#"
            className="text-white hover:text-blue-500 block px-3 py-2 rounded-md text-base font-medium transition duration-300"
          >
            İletişim
          </a>
        </div>
      </div>
    </nav>
  );
}
