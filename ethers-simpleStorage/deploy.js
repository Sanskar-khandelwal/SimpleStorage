const ethers = require("ethers");
const { readFile, readFileSync } = require("fs");
const fs = require("fs-extra");
require("dotenv").config();
async function main() {
  //http://127.0.0.1:7545
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  // const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf-8");
  // let wallet = new ethers.Wallet.fromEncryptedJsonSync(
  //   encryptedJson,
  //   process.env.PRIVATE_KEY_PASSWORD
  // );
  // wallet = await wallet.connect(provider);
  // const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const abi = readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf-8");
  const binary = readFileSync("./SimpleStorage_sol_SimpleStorage.bin", "utf-8");
  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log("Deploying this wait...");
  const contract = await contractFactory.deploy();
  //   console.log(contract);
  await contract.deployTransaction.wait(1);
  console.log(`Contract Address: ${contract.address}`);
  //get number
  const currentFavouriteNumber = await contract.retrieve();
  console.log(
    `current favourite number : ${currentFavouriteNumber.toString()}`
  );
  const transactionResponse = await contract.store("7");
  const transationReceipt = await transactionResponse.wait(1);
  const updatedFavoriteNumber = await contract.retrieve();
  console.log(`updated fav number is : ${updatedFavoriteNumber.toString()}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
