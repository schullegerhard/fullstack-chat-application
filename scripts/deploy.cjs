const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const IdentityVault = await ethers.getContractFactory("IdentityVault");
  const identityVault = await IdentityVault.deploy();

  await identityVault.waitForDeployment();

  console.log("IdentityVault deployed to:", await identityVault.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 