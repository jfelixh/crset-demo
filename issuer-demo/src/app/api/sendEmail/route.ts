import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { toDataURL } from "qrcode";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); 
    const { vcid, email } = body;
    console.log("trying to send email");
    if (!vcid || !email) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const credentialOffer = {
      credential_issuer: process.env.NEXT_PUBLIC_URL + "/vci/" + vcid,
      credential_configuration_ids: ["ProofOfEmploymentCredential"],
      grants: {
        "urn:ietf:params:oauth:grant-type:pre-authorized_code": {
          "pre-authorized_code": "oaKazRN8I0IbtZ0C7JuMn5",
        },
      },
    };

    const qrData = `openid-credential-offer://?credential_offer=${encodeURIComponent(
      JSON.stringify(credentialOffer)
    )}`;

   
    const qrCode = await toDataURL(qrData);

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail", // email service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log("trying to send email actually");
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: `${process.env.EMAIL_USER}@gmail.com`,
      subject: "Your Verifiable Credential QR Code",
      text: "Scan the attached QR code to download your credential.",
      attachments: [
        {
          filename: "qr-code.png",
          content: qrCode.split(",")[1],
          encoding: "base64",
        },
      ],
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Send email error",error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
