import { useEffect, useState } from "react";
import { Button } from "src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
import { Label } from "src/components/ui/label";
import { Input } from "src/components/ui/input";
import { useLogin } from "src/hooks/useLogin";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [backendError, setBackendError] = useState("");

  const { login, isLoading, error } = useLogin();

  useEffect(() => {
    setBackendError(error);
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // console.log({email, password})
    // need sometimes to fetch the data
    await login(email, password);
  };

  return (
    <div className="flex items-center justify-center my-20">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="harrysmitch@gmail.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setBackendError("");
                  }}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Your Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setBackendError("");
                  }}
                />
              </div>
            </div>
            <Button className="w-full mt-6" type="submit" disabled={isLoading}>
              Sign In
            </Button>
            <div className="text-red-500 mt-2">{backendError}</div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
