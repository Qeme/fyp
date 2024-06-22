import PreviewImage from "src/components/PreviewImage";
import { Button } from "src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
import { Input } from "src/components/ui/input";
import useImageUploader from "src/hooks/useImageUploader";
import { useForm } from "react-hook-form";
import { Label } from "src/components/ui/label";

const PaymentForm = ({ tournamentid }) => {
  const { register, handleSubmit } = useForm();
  const { onFileSelect, uploadFile } = useImageUploader(); // use the hook

  console.log(tournamentid)
  const onSubmit = async (data) => {
    // console.log(data);
    await uploadFile(tournamentid, "receipt"); // use the hook's upload function
  };

  return (
    <Card className="w-[400px] my-16">
      <CardHeader>
        <CardTitle>Upload Receipt</CardTitle>
        <CardDescription>
          Make sure to upload the receipt to enter the tournament.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid w-full items-center">
            <PreviewImage tournamentid={tournamentid} topic={"receipt"} />
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="picture">File/Picture</Label>
              <Input
                id="picture"
                type="file"
                {...register("file", { onChange: onFileSelect })}
                className="flex-1"
              />
              <Button type="submit">Upload</Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PaymentForm;
