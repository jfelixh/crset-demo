"use client";
import { useEffect, useState, useCallback } from "react";
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
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useUnpublishedEntriesContext } from "../contexts/UnpublishedEntriesContext";
import { AlertTitle } from "@/components/ui/alert";
import { File, Filter, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const UsersPage = () => {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statuses, setStatuses] = useState<{ [key: string]: string }>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const skeletonStyle = "w-[40px] h-[20px] bg-gray-300 rounded-full";
  const {
    thereIsUnpublished,
    unpublishedEntries,
    setThereIsUnpublished,
    setUnpublishedEntries,
  } = useUnpublishedEntriesContext();
  const [openDialogue, setOpenDialogue] = useState(false);
  const [isFilterNone, setFilterNone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState("all");
  const [isMounted, setIsMounted] = useState(false);

  const getCredentialStatus = useCallback(async (user: any) => {
    const response = await fetch("/api/get_status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: user }),
    });
    const result = await response.json();
    return result.data.status;
  }, []);

  useEffect(() => {
    // Ensure the component is mounted before changing state
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return; // Only update on the client side after mount
    // Optionally, you can update selectedOption here if needed
  }, [isMounted]);

  const toggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      const data = await response.json();
      console.log("data for users", data);
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false); // Set loading to false once data is fetched
    }
  };

  useEffect(() => {
    console.log("repeatedly going?");
    fetchUsers();
  }, []);

  useEffect(() => {
    console.log("users:", users);

    const filteredUsers = users
      .filter((user: any) =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .filter((user: any) => {
        console.log("published?", user.published);
        if (selectedOption === "all") return true;
        if (selectedOption === "Published") return user.published === true;
        if (selectedOption === "Not Published") return user.published === false;
      });
    console.log("filteredUsers:", filteredUsers);
    if (filteredUsers.length === 0) {
      setFilterNone(true);
    } else {
      setFilterNone(false);
    }
    setTopUsers(filteredUsers.slice(0, 20));
  }, [users, searchTerm, selectedOption]);

  const fetchStatusForTopUsers = useCallback(async (users: any[]) => {
    const userStatuses: { [key: string]: string } = {};
    for (const user of users) {
      const validity = await getCredentialStatus(user);
      if (validity) {
        userStatuses[user.email] = "1";
      } else {
        userStatuses[user.email] = "0";
      }
    }
    setStatuses(userStatuses);
  }, [getCredentialStatus]);

  useEffect(() => {
    fetchStatusForTopUsers(topUsers);
  }, [topUsers, fetchStatusForTopUsers]);

  const handleCheckboxChange = (user: any) => {
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
      const response2 = await fetch("/api/updatePublishById", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "singleUpdate", user: selectedUser }),
      });
      if (response2.ok) {
        console.log("Users successfully revoked");
      } else {
        throw new Error("Failed to revoke users");
      }
      fetchStatusForTopUsers(topUsers);
      setThereIsUnpublished(true);
      setUnpublishedEntries([...unpublishedEntries, selectedUser]);
      setSelectedUser(null);
      console.log("unpublishedEntries after revoke:", unpublishedEntries);
    } catch (error) {
      console.error("Error revoking users:", error);
    }
    fetchUsers();
  };

  const publishtoBFC = async () => {
    try {
      console.log("unpublishedEntries:", unpublishedEntries);
      const responseForUpdatePublish = await fetch("/api/updatePublishById", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "bulkUpdate",
          users: unpublishedEntries,
        }),
      });
      if (responseForUpdatePublish.ok) {
        console.log("Users successfully published");
      } else {
        throw new Error("Failed to revoke users");
      }
      setThereIsUnpublished(false);
      setUnpublishedEntries([]);
      fetchStatusForTopUsers(topUsers);
    } catch (error) {
      console.error("Error publishing to BFC:", error);
    }
    router.push("/bfc");
  };

  return (
    <div className="page-container">
      {thereIsUnpublished && (
        <div className="flex flex-col gap-2 pt-1">
          <AlertTitle className="font-semibold bg-text-white">
            <Badge className="bg-orange-500 text-white text-xl gap-x-2 animate-pulse hover:bg-orange-400 transition-colors duration-4000 ease-in-out">
              <AlertCircle className="h-5 w-5 text-white" />
              Reminder: Don&apos;t forget to publish!
            </Badge>
          </AlertTitle>
        </div>
      )}
      <div className="flex items-center mb-4 space-x-4 pt-2">
        <Input
          type="text"
          placeholder="Search by Email Address"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Dialog open={openDialogue} onOpenChange={setOpenDialogue}>
          {" "}
          {/* Control dialog visibility */}
          <DialogTrigger asChild>
            <Filter
              className="cursor-pointer"
              onClick={() => setOpenDialogue(true)} // Open the dialog when clicked
            />
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Set Filters</DialogTitle>
              <DialogDescription>
                Select the filter options below to filter the data.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label>Filter:</Label>
                <RadioGroup
                  value={selectedOption}
                  onValueChange={(value) => {
                    setSelectedOption(value);
                    setOpenDialogue(false);
                  }}
                  className="flex flex-row gap-6" // Makes the items align horizontally with spacing
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem id="Published" value="Published" />
                    <Label htmlFor="Published">Published</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem id="Not Published" value="Not Published" />
                    <Label htmlFor="Not Published">Not Published</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem id="all" value="all" />
                    <Label htmlFor="all">All</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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
                {topUsers.map((user: any) => {
                  return (
                    <TableRow key={user.email}>
                      <TableCell>
                        <Checkbox
                          checked={selectedUser === user}
                          onCheckedChange={() => handleCheckboxChange(user)}
                        />
                      </TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.jobTitle}</TableCell>
                      <TableCell>
                        {statuses[user.email] ? (
                          <Badge
                            className={
                              statuses[user.email] === "1"
                                ? "bg-green-500 text-white hover:bg-green-400"
                                : "bg-red-500 text-white hover:bg-red-400"
                            }
                          >
                            {statuses[user.email] === "1" ? "Valid" : "Invalid"}
                          </Badge>
                        ) : (
                          <Skeleton className={skeletonStyle} />
                        )}
                      </TableCell>
                      <TableCell>
                        <File
                          className="text-sm text-gray-600 cursor-pointer hover:text-gray-800 underline hover:no-underline"
                          onClick={toggleDialog}
                        ></File>
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
                                      '"',
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
      ) : loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-grey-500"></div>
        </div>
      ) : isFilterNone ? (
        <div className="flex justify-center items-center h-96">
          <p>No users found. Filter again</p>
        </div>
      ) : (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-grey-500"></div>
        </div>
      )}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 pt-4 flex justify-end gap-2">
        <Button
          className="bg-blue-900 hover:bg-blue-700"
          onClick={revokeSelectedUser}
          disabled={selectedUser === null}
        >
          Revoke
        </Button>
        <Button
          className="bg-blue-900 hover:bg-blue-700"
          onClick={publishtoBFC}
        >
          Publish BFC
        </Button>
      </div>
    </div>
  );
};

export default UsersPage;
