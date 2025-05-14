'use client'
import { ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import RegisterClient from "./registerClient";

const Register = () => {

    const router = useRouter();

    return ( <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <a onClick={() => router.push('/')} className="flex items-center gap-2 self-center font-medium cursor-pointer">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground bg-green-600">
              <ShoppingBag className="size-4 cursor-pointer"/>
            </div>
            NFC Manager.
          </a>
          <RegisterClient />
        </div>
      </div> );
}
 
export default Register;
