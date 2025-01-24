import { Card, CardHeader, CardContent } from "./ui/card";

const SmallCard = ({ title, content }: { title: string; content: string }) => {
  return (
    <Card>
      <CardHeader>
        <h3>{title}</h3>
      </CardHeader>
      <CardContent>
        <p className="font-bold">{content}</p>
      </CardContent>
    </Card>
  );
};

export default SmallCard;
