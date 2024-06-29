"use client";

import React, { useState } from "react";
import {
  faCity,
  faCalendarAlt,
  faUsers,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Navbar from "../components/Navbar";
import { useRouter } from "next/navigation";

function Showcase() {
  const router = useRouter();

  const [city, setCity] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Arama kriterlerini ve sonuçları localStorage'a kaydedin
    localStorage.setItem(
      "searchCriteria",
      JSON.stringify({ city, checkInDate, checkOutDate, guests })
    );
    // localStorage.setItem("searchResults", JSON.stringify(data));

    // Sonuçlar sayfasına yönlendirin
    router.push("/results");
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex flex-col items-center justify-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1564613469739-c78f970f9c17?q=80&w=2947&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <Navbar />
      <div className="relative z-10 flex flex-col items-center justify-center text-center text-white mt-4 px-4 gap-8">
        <h1 className="text-5xl font-extrabold drop-shadow-lg mb-4">
          Your next hotel
          <br />
          booking with Web3
        </h1>
        <h2 className="text-lg font-light drop-shadow-lg mb-4">
          The first native Web3 Hotel Booking Platform using Blockchain,
          <br />
          the revolutionary blockchain-based hotel booking platform.
        </h2>
        <div className="relative z-10 bg-[#09090b] bg-opacity-80 shadow-lg rounded-2xl p-4 w-full max-w-4xl transform transition hover:scale-105 duration-300 ease-in-out">
          <form
            className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col md:col-span-1">
              <div className="relative">
                <FontAwesomeIcon
                  icon={faCity}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  style={{ width: 24 }}
                />
                <input
                  type="text"
                  id="city"
                  placeholder="City"
                  className="pl-10 pr-3 py-2 block w-full bg-transparent border border-white text-white placeholder-gray-400 rounded-2xl shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col md:col-span-1">
              <div className="relative">
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  style={{ width: 24 }}
                />
                <input
                  type="date"
                  id="checkIn"
                  placeholder="Check In Date"
                  className="pl-10 pr-3 py-2 block w-full bg-transparent border border-white text-white placeholder-gray-400 rounded-2xl shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col md:col-span-1">
              <div className="relative">
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  style={{ width: 24 }}
                />
                <input
                  type="date"
                  id="checkIn"
                  className="pl-10 pr-3 py-2 block w-full bg-transparent border border-white text-white placeholder-gray-400 rounded-2xl shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col md:col-span-1">
              <div className="relative">
                <FontAwesomeIcon
                  icon={faUsers}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  style={{ width: 24 }}
                />
                <input
                  type="number"
                  id="guests"
                  placeholder="Guests"
                  className="pl-10 pr-3 py-2 block w-full bg-transparent border border-white text-white placeholder-gray-400 rounded-2xl shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-center md:justify-end md:col-span-1">
              <button
                type="submit"
                className="relative !w-full flex items-center justify-center w-full md:w-auto bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 text-white py-3 px-6 rounded-2xl shadow-md hover:from-blue-500 hover:via-purple-600 hover:to-pink-500 transition duration-300 ease-in-out transform hover:scale-105"
              >
                <FontAwesomeIcon
                  icon={faSearch}
                  className="mr-2"
                  style={{ width: 24 }}
                />
                Search
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Showcase;
