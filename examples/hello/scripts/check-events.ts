import { ethers } from "hardhat";

async function main() {
  // Replace with your actual contract addresses
  const universalAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const connectedAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
  
  // Get the contract factories
  const Universal = await ethers.getContractFactory("Universal");
  const Connected = await ethers.getContractFactory("Connected");
  
  // Attach to the deployed contracts
  const universal = Universal.attach(universalAddress);
  const connected = Connected.attach(connectedAddress);
  
  console.log("Checking for events...");
  
  // Define the event signatures
  const helloEventSignature = "HelloEvent(string,string)";
  const helloEventTopic = ethers.utils.id(helloEventSignature);
  
  // Query for HelloEvent from both contracts
  const universalFilter = {
    address: universalAddress,
    topics: [helloEventTopic]
  };
  
  const connectedFilter = {
    address: connectedAddress,
    topics: [helloEventTopic]
  };
  
  // Get logs from the last 100 blocks (adjust as needed)
  const latestBlock = await ethers.provider.getBlockNumber();
  const fromBlock = Math.max(0, latestBlock - 100);
  
  console.log(`Checking for events from block ${fromBlock} to ${latestBlock}`);
  
  // Query for events from Universal contract
  const universalLogs = await ethers.provider.getLogs({
    ...universalFilter,
    fromBlock,
    toBlock: latestBlock
  });
  
  console.log(`Found ${universalLogs.length} HelloEvent logs from Universal contract`);
  
  // Decode and display Universal events
  for (const log of universalLogs) {
    try {
      const parsedLog = Universal.interface.parseLog(log);
      console.log("Universal HelloEvent:");
      console.log(`  Arg1: ${parsedLog.args[0]}`);
      console.log(`  Arg2: ${parsedLog.args[1]}`);
      console.log(`  Block: ${log.blockNumber}`);
      console.log(`  Transaction: ${log.transactionHash}`);
    } catch (error) {
      console.error("Error parsing Universal log:", error);
    }
  }
  
  // Query for events from Connected contract
  const connectedLogs = await ethers.provider.getLogs({
    ...connectedFilter,
    fromBlock,
    toBlock: latestBlock
  });
  
  console.log(`\nFound ${connectedLogs.length} HelloEvent logs from Connected contract`);
  
  // Decode and display Connected events
  for (const log of connectedLogs) {
    try {
      const parsedLog = Connected.interface.parseLog(log);
      console.log("Connected HelloEvent:");
      console.log(`  Arg1: ${parsedLog.args[0]}`);
      console.log(`  Arg2: ${parsedLog.args[1]}`);
      console.log(`  Block: ${log.blockNumber}`);
      console.log(`  Transaction: ${log.transactionHash}`);
    } catch (error) {
      console.error("Error parsing Connected log:", error);
    }
  }
  
  console.log("\nEvent checking complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });