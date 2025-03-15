import { ethers } from "hardhat";

async function main() {
  try {
    // Contract addresses
    const universalAddress = "0xbD260c7b7126C50E5a8bCB20CFD1D22eb5FBE7E5";
    const connectedAddress = "0xbD260c7b7126C50E5a8bCB20CFD1D22eb5FBE7E5";
    
    console.log("Getting contract factories...");
    const Universal = await ethers.getContractFactory("Universal");
    const Connected = await ethers.getContractFactory("Connected");
    
    // Attach to the deployed contracts
    console.log("Attaching to deployed contracts...");
    const universal = Universal.attach(universalAddress);
    const connected = Connected.attach(connectedAddress);
    
    // Print available functions
    console.log("\nUniversal contract functions:");
    Object.keys(Universal.interface.functions).forEach(func => {
      console.log(`- ${func}`);
    });
    
    console.log("\nConnected contract functions:");
    Object.keys(Connected.interface.functions).forEach(func => {
      console.log(`- ${func}`);
    });
    
    // Try to call a simple function directly
    console.log("\nTrying to call hello() directly on Universal contract...");
    try {
      if (Universal.interface.functions["hello(string)"]) {
        const tx = await universal.hello("alice");
        console.log("Transaction hash:", tx.hash);
        const receipt = await tx.wait();
        console.log("Transaction status:", receipt.status === 1 ? "Success" : "Failed");
      } else {
        console.log("hello(string) function not found on Universal contract");
      }
    } catch (error) {
      console.error("Error calling hello() on Universal:", error.message);
    }
    
    // Try to call a simple function directly on Connected
    console.log("\nTrying to call hello() directly on Connected contract...");
    try {
      if (Connected.interface.functions["hello(string)"]) {
        const tx = await connected.hello("alice");
        console.log("Transaction hash:", tx.hash);
        const receipt = await tx.wait();
        console.log("Transaction status:", receipt.status === 1 ? "Success" : "Failed");
      } else {
        console.log("hello(string) function not found on Connected contract");
      }
    } catch (error) {
      console.error("Error calling hello() on Connected:", error.message);
    }
    
    // Get available ZRC-20 tokens
    console.log("\nGetting available ZRC-20 tokens...");
    try {
      // This is a workaround since we can't directly call the tokens task
      const { execSync } = require("child_process");
      const tokensOutput = execSync("npx hardhat tokens --network zeta_testnet").toString();
      console.log(tokensOutput);
    } catch (error) {
      console.error("Error getting tokens:", error.message);
    }
    
  } catch (error) {
    console.error("Unhandled error:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });