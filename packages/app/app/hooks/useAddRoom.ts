"use client";

import { useEffect } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import abi from "../abi/booking.json";

interface UseAddRoomProps {
  pricePerPerson?: number;
  city?: string;
  maxGuests?: number;
  photoUrl?: string;
  hotelName?: string;
  onAddRoomSuccess?: () => void;
}

interface UseAddRoomReturn {
  address: `0x${string}` | undefined;
  addRoom: (() => void) | undefined;
  addRoomLoading: boolean;
  prepareAddRoomError: boolean;
  addRoomError: boolean;
}

const useAddRoom = ({
  pricePerPerson,
  hotelName,
  city,
  maxGuests,
  photoUrl,
  onAddRoomSuccess,
}: UseAddRoomProps): UseAddRoomReturn => {
  const { address } = useAccount();

  const {
    data: addRoomHash,
    writeContract: addRoom,
    isPending: addRoomLoading,
    isError: addRoomError,
  } = useWriteContract();

  const { isSuccess: txSuccess, isLoading: txLoading } =
    useWaitForTransactionReceipt({
      hash: addRoomHash,
      query: {
        enabled: Boolean(addRoomHash),
      },
    });

  useEffect(() => {
    if (txSuccess) {
      onAddRoomSuccess?.();
    }
  }, [txSuccess]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    address,
    addRoom: () =>
      addRoom?.({
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
        abi,
        functionName: "addRoom",
        args: [pricePerPerson, city, maxGuests, photoUrl],
      }),
    addRoomLoading: addRoomLoading || txLoading,
    prepareAddRoomError:
      pricePerPerson === undefined ||
      city === undefined ||
      hotelName === undefined ||
      maxGuests === undefined ||
      photoUrl === undefined,
    addRoomError,
  };
};

export { useAddRoom };
