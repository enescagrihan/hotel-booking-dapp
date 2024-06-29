"use client";

import { useEffect } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { ethers } from "ethers";
import abi from "../abi/booking.json";

interface UseBookRoomProps {
  roomId?: number;
  checkInDate?: number;
  checkOutDate?: number;
  numberOfGuests?: number;
  totalPrice?: number;
  onBookRoomSuccess?: () => void;
}

interface UseBookRoomReturn {
  address: `0x${string}` | undefined;
  bookRoom: (() => void) | undefined;
  bookRoomLoading: boolean;
  prepareBookRoomError: boolean;
  bookRoomError: boolean;
}

const useBookRoom = ({
  roomId,
  checkInDate,
  checkOutDate,
  numberOfGuests,
  totalPrice,
  onBookRoomSuccess,
}: UseBookRoomProps): UseBookRoomReturn => {
  const { address } = useAccount();

  const {
    data: bookRoomHash,
    writeContract: bookRoom,
    isPending: bookRoomLoading,
    isError: bookRoomError,
  } = useWriteContract();

  const { isSuccess: txSuccess, isLoading: txLoading } =
    useWaitForTransactionReceipt({
      hash: bookRoomHash,
      query: {
        enabled: Boolean(bookRoomHash),
      },
    });

  useEffect(() => {
    if (txSuccess) {
      onBookRoomSuccess?.();
    }
  }, [txSuccess]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    address,
    bookRoom: () =>
      bookRoom?.({
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
        abi,
        functionName: "bookRoom",
        args: [roomId, checkInDate, checkOutDate, numberOfGuests],
        overrides: {
          value: ethers.utils.parseEther(totalPrice?.toString() || "0"),
        },
      }),
    bookRoomLoading: bookRoomLoading || txLoading,
    prepareBookRoomError:
      roomId === undefined ||
      checkInDate === undefined ||
      checkOutDate === undefined ||
      numberOfGuests === undefined ||
      totalPrice === undefined,
    bookRoomError,
  };
};

export { useBookRoom };
