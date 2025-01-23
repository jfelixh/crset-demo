"use client";
import {Button} from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";
import * as React from "react"
import {Check, ChevronsUpDown} from "lucide-react"
import {cn} from "@/lib/utils"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

const jobtypes = [
    {
        value: "Full Time",
        label: "Full Time",
    },
    {
        value: "Part Time",
        label: "Part Time",
    },
    {
        value: "Intern",
        label: "Intern",
    },
]

const formSchema = z.object({
    name: z
        .string()
        .min(2, {message: "Name must be at least 2 characters long"}) // Custom error message
        .regex(/^[^\d]*$/, {message: "Name cannot contain numbers"}), // Custom error message for regex
    lastName: z
        .string()
        .min(2, {message: "Last Name must be at least 2 characters long"})
        .regex(/^[^\d]*$/, {message: "Last Name cannot contain numbers"}), // Custom error message
    email: z
        .string()
        .min(1, {message: "Email is required"})
        .email({message: "Invalid email format"}), // Custom error message for email format
    jobTitle: z
        .string()
        .min(2, {message: "Job Title must be at least 2 characters long"})
        .regex(/^[^\d]*$/, {message: "Job Title cannot contain numbers"}), // Custom error message
    manager: z
        .string()
        .min(2, {message: "Manager name must be at least 2 characters long"})
        .regex(/^[^\d]*$/, {message: "Manager name cannot contain numbers"}), // Custom error message
    employmentType: z.string().min(1),
});

export default function Home() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            lastName: "",
            email: "",
            jobTitle: "",
            manager: "",
            employmentType: "",
        },
    });

    const handleSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const response = await fetch("/api/generateVC", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    name: data.name,
                    lastName: data.lastName,
                    email: data.email,
                    jobTitle: data.jobTitle,
                }),
            });
            const responseData = await response.json();
            if (responseData?.uuid && data.email) {
                //window.location.href = `/vci/${responseData.uuid}`;
                if (!data.email || !responseData.uuid) {
                    alert("Please enter an email and ensure VCID is loaded.");
                    return;
                }

                try {
                    const response = await fetch("/api/sendEmail", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            vcid: responseData.uuid,
                            email: 'chan9908181@gmail.com',
                            //data.email,
                        }),
                    });

                    const result = await response.json();

                    if (response.ok) {
                        alert("Email sent successfully!");
                    } else {
                        alert(`Error: ${result.error}`);
                    }
                } catch (error) {
                    console.log(error);
                    alert("Failed to send email.");
                }
            } else {
                console.error("Missing UUID in the response");
            }
        } catch (error) {
            console.error("Form submission error", error);
        }
    };

    return (
        <div className="page-container">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                    <div className="flex space-x-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input type="text" {...field} />
                                    </FormControl>
                                    {form.formState.errors.name && (
                                        <FormMessage>
                                            {form.formState.errors.name.message}
                                        </FormMessage>
                                    )}
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="lastName"
                            control={form.control}
                            render={({field}) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input type="text" {...field} />
                                    </FormControl>
                                    {form.formState.errors.lastName && (
                                        <FormMessage>
                                            {form.formState.errors.lastName.message}
                                        </FormMessage>
                                    )}
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        name="email"
                        control={form.control}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="text" {...field} />
                                </FormControl>
                                {form.formState.errors.email && (
                                    <FormMessage>
                                        {form.formState.errors.email.message}
                                    </FormMessage>
                                )}
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="jobTitle"
                        control={form.control}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Job Title</FormLabel>
                                <FormControl>
                                    <Input type="text" {...field} />
                                </FormControl>
                                {form.formState.errors.jobTitle && (
                                    <FormMessage>
                                        {form.formState.errors.jobTitle.message}
                                    </FormMessage>
                                )}
                            </FormItem>
                        )}
                    />
                    <div className="flex space-x-4">
                        <FormField
                            name="manager"
                            control={form.control}
                            render={({field}) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Manager</FormLabel>
                                    <FormControl>
                                        <Input type="text" {...field} />
                                    </FormControl>
                                    {form.formState.errors.manager && (
                                        <FormMessage>
                                            {form.formState.errors.manager.message}
                                        </FormMessage>
                                    )}
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="employmentType"
                            control={form.control}
                            render={({field}) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Employment Type</FormLabel>
                                    <FormControl>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={field.value ? true : false}
                                                    className="w-full justify-between">
                                                    {field.value
                                                        ? field.value
                                                        : "Choose an Employment Type"}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                align="start"
                                                className="p-0"
                                                style={{width: "var(--radix-popover-trigger-width)"}}>
                                                <Command>
                                                    <CommandInput placeholder="Search Employment Type..."/>
                                                    <CommandList>
                                                        <CommandEmpty>No employment type found.</CommandEmpty>
                                                        <CommandGroup>
                                                            {["Full Time", "Part Time", "Intern"].map((type) => (
                                                                <CommandItem
                                                                    key={type}
                                                                    value={type}
                                                                    onSelect={(value) => {
                                                                        field.onChange(value);
                                                                    }}
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            "mr-2 h-4 w-4",
                                                                            field.value === type ? "opacity-100" : "opacity-0"
                                                                        )}
                                                                    />
                                                                    {type}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button type="submit">Generate Verifiable Credential</Button>
                </form>
            </Form>
        </div>
    );
}
