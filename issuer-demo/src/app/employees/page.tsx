"use client";
import { useState } from "react";
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

const initialUsers = [
  { id: 1, name: "John Doe", status: "valid" },
  { id: 2, name: "Jane Smith", status: "valid" },
];

const UsersPage = () => {
  const [users, setUsers] = useState(initialUsers);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleCheckboxChange = (id: number) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((userId) => userId !== id) : [...prev, id]
    );
  };

  const revokeSelectedUsers = () => {
    setUsers((prev) =>
      prev.map((user) =>
        selectedUsers.includes(user.id) ? { ...user, status: "invalid" } : user
      )
    );
    setSelectedUsers([]);
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="flex items-center mb-4 space-x-4">
        <Input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Button
          onClick={revokeSelectedUsers}
          disabled={selectedUsers.length === 0}
        >
          Revoke
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Select</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <Checkbox
                  checked={selectedUsers.includes(user.id)}
                  onCheckedChange={() => handleCheckboxChange(user.id)}
                />
              </TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersPage;
