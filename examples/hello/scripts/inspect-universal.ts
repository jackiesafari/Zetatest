import { ethers } from "hardhat";
import fs from "fs";

async function main() {
  // Read the Universal contract source code
  const universalSource = fs.readFileSync("contracts/Universal.sol", "utf8");
  console.log("Universal contract source code:");
  
  // Find the call function in the source code
  const callFunctionRegex = /function\s+call\s*\([^)]*\)[^{]*/g;
  const callFunctions = universalSource.match(callFunctionRegex);
  
  if (callFunctions && callFunctions.length > 0) {
    console.log("\nCall function signature from source:");
    callFunctions.forEach((func, index) => {
      console.log(`${index + 1}: ${func.trim()}`);
    });
  } else {
    console.log("Could not find call function in source code");
  }
  
  // Get the contract factory and interface
  const Universal = await ethers.getContractFactory("Universal");
  
  // Log the function signatures from the ABI
  console.log("\nFunction signatures from ABI:");
  for (const func of Object.values(Universal.interface.functions)) {
    if (func.name === "call") {
      console.log(`- ${func.format(ethers.utils.FormatTypes.full)}`);
      console.log(`  Parameters:`);
      func.inputs.forEach((input, index) => {
        console.log(`  ${index + 1}: ${input.name} (${input.type})`);
      });
    }
  }
  
  // Try to create a properly formatted call
  console.log("\nAttempting to create a properly formatted call...");
  
  // Get the deployed contract
  const universalAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const universal = Universal.attach(universalAddress);
  
  // Prepare the parameters based on the ABI
  const destination = ethers.utils.formatBytes32String("ethereum").slice(0, 66); // Chain identifier as bytes32
  const receiver = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
  
  // Prepare the function call data for the hello function
  const functionSignature = "hello(string)";
  const functionSelector = ethers.utils.id(functionSignature).slice(0, 10);
  const abiCoder = new ethers.utils.AbiCoder();
  const encodedParams = abiCoder.encode(["string"], ["alice"]);
  const message = functionSelector + encodedParams.slice(2);
  
  // Log the parameters we're using
  console.log(`Destination: ${destination}`);
  console.log(`Receiver: ${receiver}`);
  console.log(`Message: ${message}`);
  
  // Create the structs based on the ABI
  const gasParams = {
    gasLimit: 300000,
    isGasLimitProvided: true
  };
  
  const revertParams = {
    revertAddress: ethers.constants.AddressZero,
    isRevertAddressProvided: false,
    callOnRevert: false,
    revertMessage: "0x",
    onRevertGasLimit: 300000
  };
  
  console.log(`Gas Params: ${JSON.stringify(gasParams)}`);
  console.log(`Revert Params: ${JSON.stringify(revertParams)}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });