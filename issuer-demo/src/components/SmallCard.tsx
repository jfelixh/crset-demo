import LoadingComponent from "./LoadingComponent";
import { Card, CardHeader, CardContent } from "./ui/card";

const SmallCard = ({
  title,
  content,
  isLoading,
}: {
  title: string;
  content: string;
  isLoading?: boolean;
}) => {
  return (
    <Card>
      <CardHeader>
        <h3>{title}</h3>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <LoadingComponent />
        ) : (
          <p className="font-bold">{content}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default SmallCard;
