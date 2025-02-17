/**
 * Copyright 2024 Software Engineering for Business Information Systems (sebis) <matthes@tum.de> .
 * SPDX-License-Identifier: MIT
 */

import { promises as fs } from "fs";
import { LoginPolicy } from "@/types/LoginPolicy";

let configuredPolicy: LoginPolicy | undefined = undefined;
const path = "./src/policies/acceptAnything.json";

export const reloadConfiguredLoginPolicy = () => {
  try {
    fs.readFile(path as string, "utf8").then((file) => {
      configuredPolicy = JSON.parse(file);
    });
  } catch (error) {
    throw Error("Failed loading login policy from file: " + path);
  }
};

reloadConfiguredLoginPolicy();

export const getConfiguredLoginPolicy = () => {
  return configuredPolicy;
};
