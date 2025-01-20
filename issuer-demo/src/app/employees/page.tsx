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
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/lib/use-toast";

const UsersPage = () => {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statuses, setStatuses] = useState<{ [key: string]: string }>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const skeletonStyle = "w-[40px] h-[20px] bg-gray-300 rounded-full";

  const toast = useToast();

  const toggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
  };

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

  const fetchStatusForTopUsers = async (topUsers) => {
    const userStatuses: { [key: string]: string } = {};
    for (const user of topUsers) {
      // console.log("user:", user);
      const validity = await getCredentialStatus(user);
      if (validity) {
        userStatuses[user.email_address] = "Valid";
      } else {
        userStatuses[user.email_address] = "Invalid";
      }
      //  console.log("userStatuses:", userStatuses[user.email_address]);
    }
    setStatuses(userStatuses);
  };

  useEffect(() => {
    fetchStatusForTopUsers(topUsers);
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
      fetchStatusForTopUsers(topUsers);
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
    //  console.log("getCredentialStatus result:", result); // Ensure result is what you expect
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

      {topUsers && topUsers.length > 0 ? (
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
                {topUsers.map((user) => {
                  const vcData = JSON.parse(user.VC);
                  return (
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
                      <TableCell>
                        {statuses[user.email_address] ? (
                          statuses[user.email_address]
                        ) : (
                          <Skeleton className={skeletonStyle} />
                        )}
                      </TableCell>
                      <TableCell>
                        <span
                          className="text-sm text-gray-600 cursor-pointer hover:text-gray-800 underline"
                          onClick={toggleDialog}
                        >
                          View
                        </span>
                        <>
                          {isDialogOpen && (
                            <div
                              className="fixed inset-0 flex items-center justify-center z-50"
                              role="dialog"
                              aria-modal="true"
                              aria-labelledby="dialog-title"
                            >
                              <div className="bg-white p-6 rounded-lg shadow-sm max-w-md w-full">
                                <div className="flex justify-between items-center">
                                  <h2
                                    id="dialog-title"
                                    className="text-xl font-semibold"
                                  >
                                    Verifiable Credential
                                  </h2>
                                  <button
                                    className="text-gray-500 hover:text-gray-800 text-3xl"
                                    onClick={toggleDialog}
                                  >
                                    &times;
                                  </button>
                                </div>
                                <div className="mt-4 bg-gray-100 p-4 rounded-md font-mono text-sm overflow-y-auto h-[60vh]">
                                  <pre className="whitespace-pre-wrap break-words">
                                    {JSON.stringify(user.VC, null, 2).replace(
                                      /\\"/g,
                                      '"'
                                    )}
                                  </pre>
                                </div>
                                <div className="mt-6 flex justify-end">
                                  <Button onClick={toggleDialog}>Close</Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-grey-500"></div>
        </div>
      )}

      <div className="sticky bottom-0 bg-white border-t border-gray-200 pt-4 flex justify-start gap-2">
        <Button onClick={revokeSelectedUser} disabled={selectedUser === null}>
          Revoke
        </Button>
        <Button
          onClick={() => {
            router.push("/bfc");
          }}
        >
          Publish BFC
        </Button>
      </div>
    </div>
  );
};

export default UsersPage;
