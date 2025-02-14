import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function HorizontalRadioGroup() {
  const [selectedOption, setSelectedOption] = useState("valid");

  return (
    <RadioGroup
      value={selectedOption}
      onValueChange={(value) => setSelectedOption(value)}
      className="flex flex-row gap-6" // Makes the items align horizontally with spacing
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem id="valid" value="valid" />
        <Label htmlFor="valid">Valid</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem id="invalid" value="invalid" />
        <Label htmlFor="invalid">Invalid</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem id="all" value="all" />
        <Label htmlFor="all">All</Label>
      </div>
    </RadioGroup>
  );
}
