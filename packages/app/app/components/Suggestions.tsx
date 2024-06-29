"use client";

import React, { useEffect, useState } from "react";
import Image, { StaticImageData } from "next/image";
import { useReadContract } from "wagmi";
import abi from "../abi/booking.json";

const Suggestions = () => {
  const {
    data: rooms,
    isLoading: isGetLoading,
    isError: isGetError,
    refetch,
  } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    abi,
    functionName: "getAllRooms",
  });

  useEffect(() => {
    console.log({ rooms });
  });

  return (
    <div className="mx-56">
      <h1 className="text-4xl font-bold mb-2">List of Our Hotels</h1>
      <p className="text-lg font-medium mb-5 text-gray-500">
        Popular places to recommend for you
      </p>
      {isGetLoading ? (
        <div>loading</div>
      ) : (
        <div>
          <div className="grid grid-cols-4 gap-x-10 gap-y-10 mb-10">
            {rooms.map((cityHotel) => (
              <div
                key={cityHotel.id}
                className="flex flex-col items-center justify-center cursor-pointer shadow-md rounded-2xl p-4 border border-neutral-200"
              >
                <div className="mb-3 relative w-full h-48">
                  <Image
                    src={cityHotel.photoUrl}
                    alt="hotel"
                    fill
                    className="rounded-2xl"
                  />
                </div>
                <div className="w-full flex flex-col items-start">
                  <h3 className="font-semibold capitalize text-neutral-900 text-base">
                    {cityHotel.hotelName}
                  </h3>
                  <div>
                    <span className="capitalize">{cityHotel.city}</span>
                  </div>
                  <span className="text-sm text-neutral-500 font-normal">
                    <strong className="text-black">
                      {cityHotel.pricePerPerson.toString()} ETH
                    </strong>{" "}
                    /night
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Suggestions;
