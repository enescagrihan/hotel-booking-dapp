const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HotelReservation", function () {
  let HotelReservation;
  let contract;
  let owner;
  let addr1;
  let addr2;
  const pricePerPerson = ethers.utils.parseEther("0.1");
  const city = "Istanbul";
  const maxGuests = 2;
  const photoUrl = "http://example.com/photo.jpg";
  const checkInDate = Math.floor(Date.now() / 1000) + 86400; // 1 day from now
  const checkOutDate = checkInDate + 86400; // 1 day after check-in

  beforeEach(async function () {
    HotelReservation = await ethers.getContractFactory("HotelReservation");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    contract = await HotelReservation.deploy();
    await contract.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await contract.owner()).to.equal(owner.address);
    });
  });

  describe("Room Management", function () {
    it("Should allow the owner to add a room", async function () {
      await contract.addRoom(pricePerPerson, city, maxGuests, photoUrl);
      const room = await contract.rooms(1);
      expect(room.pricePerPerson).to.equal(pricePerPerson);
      expect(room.city).to.equal(city);
      expect(room.maxGuests).to.equal(maxGuests);
      expect(room.photoUrl).to.equal(photoUrl);
    });

    it("Should not allow non-owner to add a room", async function () {
      await expect(
        contract
          .connect(addr1)
          .addRoom(pricePerPerson, city, maxGuests, photoUrl)
      ).to.be.revertedWith("Only the owner can perform this action");
    });

    it("Should allow booking a room", async function () {
      await contract.addRoom(pricePerPerson, city, maxGuests, photoUrl);
      await contract
        .connect(addr1)
        .bookRoom(1, checkInDate, checkOutDate, 1, { value: pricePerPerson });
      const room = await contract.rooms(1);
      expect(room.isBooked).to.equal(true);
      expect(room.bookedBy).to.equal(addr1.address);
    });

    it("Should not allow booking a room with insufficient payment", async function () {
      await contract.addRoom(pricePerPerson, city, maxGuests, photoUrl);
      await expect(
        contract.connect(addr1).bookRoom(1, checkInDate, checkOutDate, 1, {
          value: ethers.utils.parseEther("0.05"),
        })
      ).to.be.revertedWith("Insufficient payment");
    });

    it("Should not allow booking a room that is already booked", async function () {
      await contract.addRoom(pricePerPerson, city, maxGuests, photoUrl);
      await contract
        .connect(addr1)
        .bookRoom(1, checkInDate, checkOutDate, 1, { value: pricePerPerson });
      await expect(
        contract
          .connect(addr2)
          .bookRoom(1, checkInDate, checkOutDate, 1, { value: pricePerPerson })
      ).to.be.revertedWith("Room is already booked");
    });

    it("Should allow cancelling a booking", async function () {
      await contract.addRoom(pricePerPerson, city, maxGuests, photoUrl);
      await contract
        .connect(addr1)
        .bookRoom(1, checkInDate, checkOutDate, 1, { value: pricePerPerson });
      await contract.connect(addr1).cancelBooking(1);
      const room = await contract.rooms(1);
      expect(room.isBooked).to.equal(false);
      expect(room.bookedBy).to.equal(ethers.constants.AddressZero);
    });

    it("Should not allow cancelling a booking by non-booker", async function () {
      await contract.addRoom(pricePerPerson, city, maxGuests, photoUrl);
      await contract
        .connect(addr1)
        .bookRoom(1, checkInDate, checkOutDate, 1, { value: pricePerPerson });
      await expect(contract.connect(addr2).cancelBooking(1)).to.be.revertedWith(
        "You did not book this room"
      );
    });

    it("Should retrieve room details correctly", async function () {
      await contract.addRoom(pricePerPerson, city, maxGuests, photoUrl);
      const roomDetails = await contract.getRoomDetails(1);
      expect(roomDetails[0]).to.equal(1);
      expect(roomDetails[1]).to.equal(pricePerPerson);
      expect(roomDetails[2]).to.equal(city);
      expect(roomDetails[3]).to.equal(maxGuests);
      expect(roomDetails[4]).to.equal(photoUrl);
    });

    it("Should retrieve all room IDs correctly", async function () {
      await contract.addRoom(pricePerPerson, city, maxGuests, photoUrl);
      await contract.addRoom(pricePerPerson, "Ankara", maxGuests, photoUrl);
      const roomIds = await contract.getAllRooms();
      expect(roomIds.length).to.equal(2);
      expect(roomIds[0]).to.equal(1);
      expect(roomIds[1]).to.equal(2);
    });
  });
});
