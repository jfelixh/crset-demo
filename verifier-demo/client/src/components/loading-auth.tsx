import { Loader2 } from "lucide-react";
import { Card, CardContent } from "./ui/card";

const AuthLoader = () => {
  return (
    <Card className="w-full max-w-sm mx-auto bg-primary/5 border-primary/10">
      <CardContent className="flex items-center justify-center p-6">
        <div className="flex items-center space-x-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-lg font-medium text-primary">Authenticating...</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthLoader;
