import {Form, FormControl, FormField, FormItem, FormLabel} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import Image from "next/image";

export default function LoginPage() {
return (
    <div className="flex flex-col items-center justify-center min-h-screen">
        <Button>Log In As Admin To Issue and Revoke IDs</Button>
    </div>
);
}