"use client";

import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useAddRoom } from "../hooks/useAddRoom";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { type BaseError, useWriteContract, useReadContract } from "wagmi";
import abi from "../abi/booking.json";

export default function Form() {
  const [hotelName, setHotelName] = useState<string>("");
  const [pricePerPerson, setPricePerPerson] = useState<number>(0);
  const [city, setCity] = useState<string>("");
  const [maxGuests, setMaxGuests] = useState<number>(0);
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedStars, setSelectedStars] = useState("");

  const {
    data: hash,
    writeContract,
    isPending,
    error,
    failureReason,
    isSuccess,
  } = useWriteContract();

  // useEffect(() => {
  //   console.log({ rooms });
  // }, [isGetLoading]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("test");

    writeContract({
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
      abi,
      functionName: "addRoom",
      args: [
        pricePerPerson,
        hotelName,
        city,
        maxGuests,
        photoUrl,
        selectedAmenities,
        selectedStars,
      ],
    });

    console.log("test2");
    console.log({ failureReason });
    console.log({ isSuccess });
    console.log({ error });

    // console.log({ rooms });
  }

  const handleAmenities = (e: any) => {
    const options = e.target.options;
    const selectedValues: any = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value);
      }
    }
    setSelectedAmenities(selectedValues);
  };

  const handleChangeStars = (e) => {
    setSelectedStars(e.target.value);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 py-10 flex-col">
      <Head>
        <title>
          Admin Form{" "}
          {/* {addRoomLoading ? (
            <p className="text-lg text-center text-gray-500 italic">
              Loading...
            </p>
          ) : (
            <p
              className={
                !addRoomError
                  ? `text-lg text-center`
                  : `text-lg text-center text-red-500`
              }
            >
              {!addRoomError
                ? "no error"
                : `There was an error getting the greeting`}
            </p>
          )} */}
        </title>
      </Head>
      <form
        className="bg-white p-6 rounded-lg shadow-md"
        style={{ borderRadius: "16px" }}
        onSubmit={submit}
      >
        <h2 className="text-2xl font-bold mb-6">Form</h2>
        <div className="mb-4">
          <label htmlFor="hotelName" className="block text-gray-700 mb-2">
            Hotel Name
          </label>
          <input
            type="text"
            id="hotelName"
            onChange={(e) => setHotelName(e.target.value)}
            name="hotelName"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="pricePerPerson" className="block text-gray-700 mb-2">
            Price Per Person
          </label>
          <input
            type="number"
            id="pricePerPerson"
            onChange={(e) => setPricePerPerson(e.target.value)}
            name="pricePerPerson"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="city" className="block text-gray-700 mb-2">
            City
          </label>
          <input
            type="text"
            onChange={(e) => setCity(e.target.value)}
            id="city"
            name="city"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="maxGuests" className="block text-gray-700 mb-2">
            Max Guests
          </label>
          <input
            type="number"
            id="maxGuests"
            onChange={(e) => setMaxGuests(e.target.value)}
            name="maxGuests"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="photoUrl" className="block text-gray-700 mb-2">
            Photo URL
          </label>
          <input
            type="url"
            id="photoUrl"
            onChange={(e) => setPhotoUrl(e.target.value)}
            name="photoUrl"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="amenities"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Select Amenities
          </label>
          <select
            id="amenities"
            name="amenities"
            multiple
            size={5}
            className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={handleAmenities}
            value={selectedAmenities}
          >
            <option value="spa">Spa & Wellness</option>
            <option value="parking">Parking</option>
            <option value="pets">Pets</option>
            <option value="gym">Gym</option>
            <option value="kids">Kids-friendly</option>
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="stars"
            className="block text-sm font-medium text-gray-700 mt-4 mb-2"
          >
            Select Stars
          </label>
          <select
            id="stars"
            name="stars"
            className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={handleChangeStars}
            value={selectedStars}
          >
            <option value="">Select stars</option>
            <option value="1">1 Star</option>
            <option value="2">2 Stars</option>
            <option value="3">3 Stars</option>
            <option value="4">4 Stars</option>
            <option value="5">5 Stars</option>
          </select>
        </div>

        <div className="text-right">
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {isPending ? "Confirming..." : "Submit"}
          </button>
        </div>
      </form>
      {hash && <div className="pt-10">Transaction Hash: {hash}</div>}
    </div>
  );
}
