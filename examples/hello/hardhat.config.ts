import "@nomicfoundation/hardhat-toolbox";
import { HardhatUserConfig } from "hardhat/config";
import * as dotenv from "dotenv";

import "./tasks/deploy";
import "@zetachain/localnet/tasks";
import "@zetachain/toolkit/tasks";
// Remove this line: import "@zetachain/hardhat-plugin";
import { getHardhatConfig } from "@zetachain/toolkit/client";

dotenv.config();

const config: HardhatUserConfig = {
  ...getHardhatConfig({ accounts: [process.env.PRIVATE_KEY] }),
  solidity: {
    compilers: [
      {
        version: "0.8.26",
      },
      {
        version: "0.8.28",
      }
    ]
  },
};

export default config;