import Image from "next/image";
import {Button} from "@/components/ui/button";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex">
            {/* Left Section */}
            <div className="w-1/2 bg-white-100">
                <div className="top-2 left-2">
                    <Image
                        src="/images/bmw-logo-2020.jpg" // Path to your logo
                        alt="Company Logo"
                        width={100} // Adjust the width as needed
                        height={50} // Adjust the height as needed
                    />
                </div>
                <div className="flex flex-col items-center justify-center h-1/2 space-y-24 mr-40">
                    <div>
                        <h1 className="text-1xl">Start your journey</h1>
                        <h1 className="text-4xl font-bold">Log In</h1>
                    </div>
                    <Button className="mt-8">Get Started</Button>
                </div>
            </div>

            {/* Right Section */}
            <div className="w-1/2 relative">
                <Image
                    src="/images/loginBackGroundImage.png"
                    alt="LogIn Image"
                    layout="fill"
                    objectFit="cover"
                />
            </div>
        </div>
    );
}