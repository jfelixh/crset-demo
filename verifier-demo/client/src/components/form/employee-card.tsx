import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { EmployeeCredential } from "@/models/employee";
import { GlareCard } from "../ui/glare-card";

interface EmployeeCardProps {
  employee: EmployeeCredential;
}

export function EmployeeCard({ employee }: EmployeeCardProps) {
  const { id, type, name, familyName, email, companyName, jobTitle } = employee;

  return (
    <GlareCard className="p-2">
      <Card
        className={cn(
          "w-full h-full bg-transparent border-none shadow-none space-y-2"
        )}
      >
        <CardHeader className="flex flex-row items-center space-x-4 pb-2">
          <InitialsAvatar name={name || ""} familyName={familyName || ""} />
          <div className="text-gray-200 text-2xl">
            <CardTitle>{`${name || ""} ${familyName || ""}`}</CardTitle>
            <p className="text-sm text-muted-foreground">{jobTitle}</p>
          </div>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4 text-sm text-gray-200">
            <div>
              <dt className="font-bold">ID</dt>
              <dd>{id}</dd>
            </div>
            <div>
              <dt className="font-bold">Type</dt>
              <dd>{type}</dd>
            </div>
            <div>
              <dt className="font-bold">Email</dt>
              <dd>{email}</dd>
            </div>
            <div>
              <dt className="font-bold">Company</dt>
              <dd>{companyName}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </GlareCard>
  );
}

interface InitialsAvatarProps {
  name: string;
  familyName: string;
}

export function InitialsAvatar({ name, familyName }: InitialsAvatarProps) {
  const initials = `${name?.[0] || ""}${familyName?.[0] || ""}`.toUpperCase();

  return (
    <Avatar>
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}
