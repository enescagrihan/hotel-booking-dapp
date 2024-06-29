// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HotelReservation {
    struct Reservation {
        address customer;
        uint256 checkInDate;
        uint256 checkOutDate;
    }

    struct Room {
        uint256 id;
        uint256 pricePerPerson;
        string hotelName;
        string city;
        uint256 maxGuests;
        string photoUrl;
        string[] amenities;
        uint8 starRating;
        Reservation[] reservations;
    }

    Room[] public rooms;
    mapping(string => uint256[]) private cityToRoomIds;
    uint256 public roomCount;
    address public owner;

    event RoomAdded(uint256 roomId, string hotelName, string city);
    event RoomBooked(uint256 roomId, address customer, uint256 checkInDate, uint256 checkOutDate, uint256 totalPrice);
    event BookingCanceled(uint256 roomId, address customer);

    constructor() payable{
        owner = msg.sender;  // Sözleşmeyi dağıtan kişi otel sahibi olarak atanır
    }

    function addRoom(
        uint256 pricePerPerson,
        string memory hotelName,
        string memory city,
        uint256 maxGuests,
        string memory photoUrl,
        string[] memory amenities,
        uint8 starRating
    ) public {
        roomCount++;
        Room storage newRoom = rooms.push();
        newRoom.id = roomCount;
        newRoom.pricePerPerson = pricePerPerson;
        newRoom.hotelName = hotelName;
        newRoom.city = city;
        newRoom.maxGuests = maxGuests;
        newRoom.photoUrl = photoUrl;
        newRoom.amenities = amenities;
        newRoom.starRating = starRating;

        cityToRoomIds[city].push(roomCount - 1);  // Store the index instead of the id

        emit RoomAdded(roomCount, hotelName, city);
    }

    function bookRoom(uint256 roomId, uint256 checkInDate, uint256 checkOutDate, uint256 totalPrice) public payable {
        require(roomId > 0 && roomId <= roomCount, "Invalid room ID");
        require(checkInDate < checkOutDate, "Invalid date range");
        require(isRoomAvailable(roomId, checkInDate, checkOutDate), "Room is not available for the given date range");

        Room storage room = rooms[roomId - 1];

        require(msg.value >= totalPrice, "Insufficient payment");

        room.reservations.push(Reservation({
            customer: msg.sender,
            checkInDate: checkInDate,
            checkOutDate: checkOutDate
        }));

        // Oda rezervasyonu yapıldığında ödemeyi doğrudan otel sahibine transfer et
        payable(owner).transfer(msg.value);

        emit RoomBooked(roomId, msg.sender, checkInDate, checkOutDate, totalPrice);
    }

    function cancelBooking(uint256 roomId, uint256 reservationIndex) public {
        require(roomId > 0 && roomId <= roomCount, "Invalid room ID");
        Room storage room = rooms[roomId - 1];
        require(reservationIndex < room.reservations.length, "Invalid reservation index");
        require(room.reservations[reservationIndex].customer == msg.sender, "You can only cancel your own booking");

        for (uint256 i = reservationIndex; i < room.reservations.length - 1; i++) {
            room.reservations[i] = room.reservations[i + 1];
        }
        room.reservations.pop();

        emit BookingCanceled(roomId, msg.sender);
    }

    function getRoomDetails(uint256 roomId) public view returns (Room memory) {
        require(roomId > 0 && roomId <= roomCount, "Invalid room ID");
        return rooms[roomId - 1];
    }

    function getAllRooms() public view returns (Room[] memory) {
        return rooms;
    }

    function getHotelsByCity(string memory city) public view returns (Room[] memory) {
        uint256[] memory roomIndices = cityToRoomIds[city];
        Room[] memory result = new Room[](roomIndices.length);
        for (uint256 i = 0; i < roomIndices.length; i++) {
            result[i] = rooms[roomIndices[i]];
        }
        return result;
    }

    function getAvailableRooms(uint256 checkInDate, uint256 checkOutDate) public view returns (Room[] memory) {
        uint256 availableRoomCount = 0;
        for (uint256 i = 0; i < rooms.length; i++) {
            if (isRoomAvailable(i + 1, checkInDate, checkOutDate)) {
                availableRoomCount++;
            }
        }

        Room[] memory availableRooms = new Room[](availableRoomCount);
        uint256 j = 0;
        for (uint256 i = 0; i < rooms.length; i++) {
            if (isRoomAvailable(i + 1, checkInDate, checkOutDate)) {
                availableRooms[j] = rooms[i];
                j++;
            }
        }

        return availableRooms;
    }

    function getAvailableRoomsByCity(string memory city, uint256 checkInDate, uint256 checkOutDate) public view returns (Room[] memory) {
        uint256[] memory roomIndices = cityToRoomIds[city];
        uint256 availableRoomCount = 0;
        for (uint256 i = 0; i < roomIndices.length; i++) {
            if (isRoomAvailable(roomIndices[i] + 1, checkInDate, checkOutDate)) {
                availableRoomCount++;
            }
        }

        Room[] memory availableRooms = new Room[](availableRoomCount);
        uint256 j = 0;
        for (uint256 i = 0; i < roomIndices.length; i++) {
            if (isRoomAvailable(roomIndices[i] + 1, checkInDate, checkOutDate)) {
                availableRooms[j] = rooms[roomIndices[i]];
                j++;
            }
        }

        return availableRooms;
    }

    function isRoomAvailable(uint256 roomId, uint256 checkInDate, uint256 checkOutDate) internal view returns (bool) {
        Room storage room = rooms[roomId - 1];
        for (uint256 i = 0; i < room.reservations.length; i++) {
            Reservation storage reservation = room.reservations[i];
            if (checkInDate < reservation.checkOutDate && checkOutDate > reservation.checkInDate) {
                return false;
            }
        }
        return true;
    }
}
