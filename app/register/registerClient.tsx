"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const RegisterClient = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: SubmitHandler<Record<string, any>> = (data: any) => {
    setIsLoading(true);

    axios
      .post("/api/register", data)
      .then(() => {
        toast.success("Registration successful! Please verify your email.");
        router.push("/login");
      })
      .catch((error) => {
        toast.error("Something went wrong. Please try again.");
      })
      .then(() => {
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
              <CardHeader>
                <CardTitle>Vendor Information</CardTitle>
                <CardDescription>
                  Enter your details to become a Vendor.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="username">Username</Label>
                  <Input {...register("username", { required: true })} id="username" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    {...register("email", { required: true })}
                    id="email"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    {...register("password", { required: true })}
                    id="password"
                    type="password"
                  />
                </div>
                <Button type="submit" disabled={isLoading} className="w-full">
                  Register
                </Button>
                <div className="text-center text-sm">
                Already have an account?{" "}
                <a
                  onClick={() => router.push("/login")}
                  className="underline underline-offset-4 cursor-pointer hover:text-green-600 transition-colors duration-300"
                >
                  Log in
                </a>
              </div>
              </CardContent>
            </Card>
      </form>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
};

export default RegisterClient;
