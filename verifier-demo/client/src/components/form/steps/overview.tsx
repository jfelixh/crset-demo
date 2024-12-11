import { useFormContext } from "react-hook-form";

const PreviewStep = () => {
  const { getValues } = useFormContext();
  const values = getValues();

  return (
    <div>
      <h3>Preview</h3>
      <pre>{JSON.stringify(values, null, 2)}</pre>
    </div>
  );
};

export default PreviewStep;
