import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";

task("universal-call", "Call a contract on a connected EVM chain from a Universal app")
  .addParam("contract", "The address of the Universal contract on ZetaChain")
  .addParam("receiver", "The address of the receiver contract on the connected chain")
  .addParam("zrc20", "The address of the ZRC-20 token")
  .addParam("function", "The function signature to call (e.g., 'hello(string)')")
  .addParam("types", "The types of the parameters (example: '[\"string\"]')")
  .addVariadicPositionalParam("values", "The values of the parameters")
  .setAction(async (taskArgs, hre: HardhatRuntimeEnvironment) => {
    const { contract, receiver, zrc20, function: functionSig, types, values } = taskArgs;
    
    // Get the contract instance
    const Universal = await hre.ethers.getContractFactory("Universal");
    const universal = Universal.attach(contract);
    
    console.log(`Calling Universal contract at ${contract}`);
    console.log(`Receiver: ${receiver}`);
    console.log(`ZRC-20: ${zrc20}`);
    console.log(`Function: ${functionSig}`);
    console.log(`Types: ${types}`);
    console.log(`Values: ${values}`);
    
    // Parse the types
    const parsedTypes = JSON.parse(types);
    
    // Extract function name from the signature
    const functionName = functionSig.split("(")[0];
    
    // Encode the function call
    const abiCoder = new hre.ethers.utils.AbiCoder();
    const encodedParams = abiCoder.encode(parsedTypes, values);
    
    // Create the function selector
    const functionSelector = hre.ethers.utils.id(functionSig).slice(0, 10);
    
    // Combine function selector with encoded parameters
    const calldata = functionSelector + encodedParams.slice(2);
    
    // Get the chain ID for the connected chain (assuming chain ID 1 for this example)
    const chainId = 1;
    
    // Call the contract with the correct number of parameters
    // Adjust this line based on your Universal contract's call function signature
    const tx = await universal.call(chainId, receiver, zrc20, 0, calldata);
    await tx.wait();
    
    console.log(`Transaction hash: ${tx.hash}`);
    console.log("Call successful!");
  });