"use client";
import {useEffect, useState} from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {Checkbox} from "@/components/ui/checkbox";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";


const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("/api/users");
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        console.log("Users fetched:", users);
    }, [users]);

    const handleCheckboxChange = (id: number) => {
        setSelectedUser(prevSelected => (prevSelected === id ? null : id));
    };

    const revokeSelectedUser = async () => {
        try {
           // setUsers((prev) =>
           //     prev.map((user) =>
           //         selectedUsers.includes(user.id) ? {...user, status: "invalid"} : user
           //     )
            //);
            setUsers((prev) =>
                prev.map((user) =>
                    user.id === selectedUser ? { ...user, status: "invalid" } : user
                )
            );
            const response = await fetch('/api/revoke-users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user: selectedUser }),
            });
            if (response.ok) {
                console.log('Users successfully revoked');
            } else {
                throw new Error('Failed to revoke users');
            }
            setSelectedUser(null);
        }catch (error) {
            console.error("Error revoking users:", error);
        }
    };

    const filteredUsers = users.filter((user) =>
        user.email_address.includes(searchTerm)
    );
    const topUsers = filteredUsers.slice(0, 100);

    return (
        <div className="page-container">
            <div className="flex items-center mb-4 space-x-4">
                <Input
                    type="text"
                    placeholder="Search by Email Address"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                />
            </div>
            <div className="overflow-x-auto max-w-full">
                <div className="overflow-y-auto max-h-screen">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Select</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Email Address</TableHead>
                                <TableHead>ID</TableHead>
                                <TableHead>Status</TableHead>

                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {topUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedUser === user.id}
                                            onCheckedChange={() => handleCheckboxChange(user.id)}
                                        />
                                    </TableCell>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email_address}</TableCell>
                                    <TableCell>{user.id}</TableCell>
                                    <TableCell>{user.status}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
                <Button
                    onClick={revokeSelectedUser}
                    disabled={selectedUser === null}
                >
                    Revoke
                </Button>
            </div>
        </div>
    );
};

export default UsersPage;
