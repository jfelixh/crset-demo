/**
 * Copyright 2024 Software Engineering for Business Information Systems (sebis) <matthes@tum.de> .
 * SPDX-License-Identifier: MIT
 */

import { promises as fs } from "fs";
// import { isLoginPolicy } from "../lib/isLoginPolicy";
import { LoginPolicy } from "../types/LoginPolocy";
import dotenv from "dotenv";

// config({
//   path: "../.env",
// });
dotenv.config();

let configuredPolicy: LoginPolicy | undefined = undefined;

export const reloadConfiguredLoginPolicy = async () => {
  if (process.env.LOGIN_POLICY) {
    try {
      const file = await fs.readFile(
        process.env.LOGIN_POLICY as string,
        "utf8",
      );
      configuredPolicy = JSON.parse(file);
      // console.log("logging the policy", configuredPolicy);

      /*  if (!isLoginPolicy(configuredPolicy)) {
        throw Error(
          "Configured login policy has syntax error: " + configuredPolicy,
        );
      } */
    } catch (error) {
      throw Error(
        "Failed loading login policy from file: " + process.env.LOGIN_POLICY,
      );
    }
  } else {
    throw Error("No login policy file path set");
  }
};

export const getConfiguredLoginPolicy = async () => {
  // Ensure we wait for reloadConfiguredLoginPolicy to complete
  if (!configuredPolicy) {
    await reloadConfiguredLoginPolicy();
  }
  return configuredPolicy;
};
