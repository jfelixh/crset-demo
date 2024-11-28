/**
 * Copyright 2024 Software Engineering for Business Information Systems (sebis) <matthes@tum.de> .
 * SPDX-License-Identifier: MIT
 */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { keyToDID } from "@spruceid/didkit-wasm-node";

export async function GET(request: NextRequest): Promise<Response> {
  try {
    const loginChallenge = crypto.randomUUID(); // Generate a unique challenge
    const clientId = keyToDID("key", process.env.DID_KEY_JWK!);
    const externalUrl = process.env.EXTERNAL_URL!;

    const walletUrl =
      "openid-vc://?client_id=" +
      clientId +
      "&request_uri=" +
      encodeURIComponent(
        externalUrl + "/api/presentCredential?login_id=" + loginChallenge
      );

    return NextResponse.json({ status: 200, uuid: loginChallenge, walletUrl });
  } catch (error) {
    return NextResponse.json({ status: 500, redirect: "/error" });
  }
}
