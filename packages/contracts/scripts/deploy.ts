import { ethers } from "hardhat";

async function main() {
  const welcomeMessage = "Hello, world!";
  const booking = await ethers.deployContract("HotelReservation");
  await booking.waitForDeployment();
  console.log(
    `Greeter with greeting "${welcomeMessage}" deployed to ${booking.target}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
