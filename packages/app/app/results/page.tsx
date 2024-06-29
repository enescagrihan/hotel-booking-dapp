"use client";
import React, { useEffect, useState } from "react";
import { useReadContract, useWriteContract } from "wagmi";
import abi from "../abi/booking.json";
import { ethers } from "ethers";

const page = () => {
  const [searchCriteria, setSearchCriteria] = useState({});

  useEffect(() => {
    // localStorage'dan verileri çekin
    const storedCriteria = JSON.parse(
      localStorage.getItem("searchCriteria") || "{}"
    );

    if (storedCriteria) {
      setSearchCriteria(storedCriteria);
    }
  }, []);

  const {
    data: rooms,
    isLoading: isGetLoading,
    isError: isGetError,
    refetch,
    error: getError,
  } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    abi,
    functionName: "getAvailableRoomsByCity",
    args: [
      searchCriteria.city,
      new Date(searchCriteria.checkInDate).getTime() / 1000,
      new Date(searchCriteria.checkOutDate).getTime() / 1000,
    ],
  });

  const {
    data: hash,
    writeContract,
    isPending,
    error: isWriteError,
    failureReason,
    isSuccess: isWriteSuccess,
  } = useWriteContract();

  if (isGetError) {
    console.log({ isGetError });

    return <div>Veri yüklenirken bir hata oluştu.</div>;
  }

  const bookRoom = (roomId: string, totalPrice: number) => {
    writeContract({
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
      abi,
      functionName: "bookRoom",
      args: [
        roomId,
        new Date(searchCriteria.checkInDate).getTime() / 1000,
        new Date(searchCriteria.checkOutDate).getTime() / 1000,
        ethers.parseUnits(totalPrice.toString(), "ether"),
      ],
      value: ethers.parseUnits(totalPrice.toString(), "ether"),
    });

    console.log({ isWriteSuccess });
    console.log({ isWriteError });
    console.log({ failureReason });
  };

  const calculateDayDifference = (startDate: string, endDate: string) => {
    // Tarihleri Date objesine dönüştür
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Zaman farkını milisaniye cinsinden hesapla
    const timeDifference = end.getTime() - start.getTime();

    // Milisaniye cinsinden gün farkını hesapla
    const dayDifference = timeDifference / (1000 * 3600 * 24);

    return dayDifference;
  };

  const renderStars = (starCount: number) => {
    const stars = [];
    for (let i = 0; i < starCount; i++) {
      stars.push(
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M7.10341 2.31062C7.47023 1.56737 8.53007 1.56737 8.89688 2.31062L10.4021 5.3606L13.768 5.84969C14.5882 5.96888 14.9157 6.97685 14.3222 7.55539L11.8867 9.92947L12.4616 13.2817C12.6017 14.0986 11.7443 14.7216 11.0107 14.3359L8.00015 12.7532L4.98963 14.3359C4.256 14.7216 3.39857 14.0986 3.53868 13.2817L4.11364 9.92947L1.67808 7.55539C1.08456 6.97685 1.41207 5.96888 2.23229 5.84969L5.59815 5.3606L7.10341 2.31062Z"
            fill="#42E6FF"
          ></path>
        </svg>
      );
    }
    return stars;
  };

  const calculatePrice = (pricePerPerson: string) => {
    return (
      parseFloat(searchCriteria.guests) *
      calculateDayDifference(
        searchCriteria.checkInDate,
        searchCriteria.checkOutDate
      ) *
      parseFloat(pricePerPerson)
    );
  };

  // const totalPrice = ethers.utils.parseEther("1.0");

  return (
    <div className="container flex flex-col mx-auto px-4">
      <div className="text-sleap-gray-100">
        <div className="flex flex-col lg:flex-row lg:gap-12 pb-6 pt-6">
          <div className="lg:w-1/4">
            <h1 className="block w-full font-medium lg:w-auto lg:mb-0 mb-4 text-h1-mobile sm:text-h1-ipad lg:text-h1-desktop xl:text-h1-desktop text-lightwhite">
              <span className="text-[63px] bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 font-bold">
                {isGetLoading ? "..." : rooms.length}{" "}
              </span>{" "}
              properties in{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 font-bold">
                {searchCriteria.city}
              </span>{" "}
              found
            </h1>
          </div>
          <div className="w-full lg:w-3/4">
            {isGetLoading ? (
              <div className="bg-gray-100 border-gray-300 overflow-hidden md:p-4 p-2 gap-6 self-stretch rounded-2xl shadow mb-4 animate-pulse">
                <div className="flex sm:gap-x-6 gap-x-3">
                  <div className="w-full sm:w-[168px] sm:h-[168px] lg:w-[234px] md:w-[200px] lg:h-[234px] md:w-[200px] md:h-[200px] sm:block hidden relative">
                    <div className="w-full h-full bg-gray-300 rounded-2xl"></div>
                  </div>
                  <div className="sm:w-fit w-full">
                    <div>
                      <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                      <div className="sm:flex items-start sm:mb-3 mb-2">
                        <div className="flex sm:me-2">
                          <div className="h-4 bg-gray-300 rounded w-12 mr-1"></div>
                          <div className="h-4 bg-gray-300 rounded w-12 mr-1"></div>
                          <div className="h-4 bg-gray-300 rounded w-12 mr-1"></div>
                          <div className="h-4 bg-gray-300 rounded w-12 mr-1"></div>
                          <div className="h-4 bg-gray-300 rounded w-12"></div>
                        </div>
                        <div className="h-4 bg-gray-300 rounded w-1/4 mt-1"></div>
                      </div>
                    </div>
                    <div className="flex sm:flex-col flex-col-reverse">
                      <div className="hidden md:flex flex-wrap items-center text-sm text-purple-400 sm:mt-3 sm:mb-0 mb-2 gap-2">
                        <div className="h-4 bg-gray-300 rounded w-16"></div>
                        <div className="h-4 bg-gray-300 rounded w-16"></div>
                        <div className="h-4 bg-gray-300 rounded w-16"></div>
                      </div>
                    </div>
                    <div className="h-6 bg-gray-300 rounded w-1/2 mt-6 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/4 mt-1 mb-3"></div>
                  </div>
                  <div className="sm:flex flex-col md:w-auto w-[37%] justify-center hidden ms-auto">
                    <div className="text-right">
                      <div className="sm:flex justify-center hidden">
                        <button className="relative !w-full flex items-center justify-center gap-x-1.5 w-full md:w-auto bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 text-white py-3 px-6 rounded-2xl shadow-md hover:from-blue-500 hover:via-purple-600 hover:to-pink-500 transition duration-300 ease-in-out transform hover:scale-105">
                          Book
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M19 12L13 6M19 12L13 18M19 12H5"
                              stroke="#CDB9FF"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            ></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              rooms.map((room: any, index: number) => (
                <div
                  key={index}
                  className="bg-sleap-gray-850 border-sleap-gray-700 overflow-hidden md:p-4 p-2 gap-6 self-stretch rounded-2xl shadow mb-4"
                >
                  <div className="flex sm:gap-x-6 gap-x-3">
                    <div className="w-full sm:w-[168px] sm:h-[168px] lg:w-[234px] md:w=[200px] lg:h-[234px] md:w-[200px] md:h-[200px] sm:block hidden relative">
                      <img
                        className="w-full md:w-[200px] md:h-[200px] lg:w-[234px] lg:h-[234px] sm:w-[168px] sm:h-[168px] cursor-pointer rounded-2xl bg-cover bg-no-repeat"
                        src={room.photoUrl}
                        alt={room.hotelName}
                      />
                    </div>
                    <div className="sm:w-fit w-full">
                      <div>
                        <h2 className="hidden md:block sm:text-xl text-sm font-bold sm:mb-3 mb-2">
                          {room.hotelName}
                        </h2>
                        <p className="text-sm text-gray-400 mt-1 mb-3">
                          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 font-bold">
                            {isGetLoading ? "..." : searchCriteria.checkInDate}{" "}
                          </span>{" "}
                          -{" "}
                          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 font-bold">
                            {searchCriteria.checkOutDate}
                          </span>{" "}
                        </p>
                        <div className="sm:flex items-start sm:mb-3 mb-2">
                          <div className="flex sm:me-2">
                            {renderStars(room.starRating)}
                          </div>
                          <p className="text-sm text-gray-400 sm:mt-0 mt-1">
                            {room.city}
                          </p>
                        </div>
                      </div>
                      <div className="flex sm:flex-col flex-col-reverse">
                        <div className="hidden md:flex flex-wrap items-center text-sm text-sleap-purple-400 sm:mt-3 sm:mb-0 mb-2  gap-2">
                          {room.amenities.map(
                            (amenitiy: string, index: number) => (
                              <span className="flex items-center" key={index}>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 18 18"
                                  fill="none"
                                >
                                  <path
                                    d="M11.625 7.2225C11.4825 5.13 10.635 3.09 9.045 1.5C7.507 3.03224 6.56112 5.0595 6.375 7.2225C7.3425 7.7325 8.2275 8.3925 9 9.195C9.76793 8.40594 10.6534 7.74055 11.625 7.2225ZM9 11.5875C7.3875 9.1275 4.635 7.5 1.5 7.5C1.5 15 8.49 16.4175 9 16.5C9.51 16.41 16.5 15 16.5 7.5C13.365 7.5 10.6125 9.1275 9 11.5875Z"
                                    fill="#CDB9FF"
                                  ></path>
                                </svg>
                                <span className="ml-1 sm:text-sm text-xs">
                                  {amenitiy}
                                </span>
                              </span>
                            )
                          )}
                        </div>
                      </div>
                      <p className="font-inter font-semibold sm:text-2xl mt-6 leading-[24px] tracking-custom text-sleap-near-white mb-2">
                        {calculatePrice(room.pricePerPerson)} ETH
                      </p>
                      <p className="text-sm text-gray-400 mt-1 mb-3">
                        {searchCriteria.guests} Persons,{" "}
                        {calculateDayDifference(
                          searchCriteria.checkInDate,
                          searchCriteria.checkOutDate
                        )}{" "}
                        Nights
                      </p>
                    </div>
                    <div className="sm:flex flex-col md:w-auto w-[37%] justify-center hidden ms-auto">
                      <div className="text-right">
                        <div className="sm:flex justify-center hidden">
                          <button
                            onClick={() =>
                              bookRoom(
                                room.id,
                                calculatePrice(room.pricePerPerson)
                              )
                            }
                            className="relative !w-full flex items-center justify-center gap-x-1.5 w-full md:w-auto bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 text-white py-3 px-6 rounded-2xl shadow-md hover:from-blue-500 hover:via-purple-600 hover:to-pink-500 transition duration-300 ease-in-out transform hover:scale-105"
                          >
                            Book
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M19 12L13 6M19 12L13 18M19 12H5"
                                stroke="#CDB9FF"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              ></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
