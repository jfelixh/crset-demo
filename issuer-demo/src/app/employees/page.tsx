"use client";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statuses, setStatuses] = useState<{ [key: string]: string }>({});

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
    const filteredUsers = users.filter((user) =>
      user.email_address.includes(searchTerm)
    );
    setTopUsers(filteredUsers.slice(0, 20));
  }, [users, searchTerm]);

  useEffect(() => {
    const fetchStatusForTopUsers = async () => {
      const userStatuses: { [key: string]: string } = {};
      for (const user of topUsers) {
        console.log("user:", user);
        const validity = await getCredentialStatus(user);
        if (validity) {
          userStatuses[user.email_address] = "Valid";
        } else {
          userStatuses[user.email_address] = "Invalid";
        }
        console.log("userStatuses:", userStatuses[user.email_address]);
      }
      setStatuses(userStatuses);
    };
    fetchStatusForTopUsers();
  }, [topUsers]);

  const handleCheckboxChange = (user) => {
    setSelectedUser((prevSelected) => (prevSelected === user ? null : user));
  };

  const revokeSelectedUser = async () => {
    try {
      const response = await fetch("/api/revoke-users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: selectedUser }),
      });
      if (response.ok) {
        console.log("Users successfully revoked");
      } else {
        throw new Error("Failed to revoke users");
      }
      setSelectedUser(null);
    } catch (error) {
      console.error("Error revoking users:", error);
    }
  };

  const getCredentialStatus = async (user) => {
    const response = await fetch("/api/get_status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user: user }),
    });
    const result = await response.json(); // Wait for the Promise to resolve
    console.log("getCredentialStatus result:", result); // Ensure result is what you expect
    return result.data.status;
  };

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
                <TableHead>Job Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>VC</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topUsers.map((user) => (
                <TableRow key={user.email_address}>
                  <TableCell>
                    <Checkbox
                      checked={selectedUser === user}
                      onCheckedChange={() => handleCheckboxChange(user)}
                    />
                  </TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email_address}</TableCell>
                  <TableCell>{user.jobTitle}</TableCell>
                  <TableCell>{statuses[user.email_address]}</TableCell>
                  <TableCell>{user.VC}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="sticky bottom-0 bg-white border-t border-gray-200 pt-4">
        <Button onClick={revokeSelectedUser} disabled={selectedUser === null}>
          Revoke
        </Button>
      </div>
    </div>
  );
};

export default UsersPage;
