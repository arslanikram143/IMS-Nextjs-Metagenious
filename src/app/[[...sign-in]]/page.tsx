"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LoginPage = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const role = user?.publicMetadata.role;
    if (role) router.push(`/${role}`);
  }, [user, router]);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden">
      {/* Background decorative glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.2),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.2),transparent_60%)]" />

      {/* Sign-in card */}
      <SignIn.Root>
        <SignIn.Step
          name="start"
          className="relative z-10 backdrop-blur-xl bg-white/10 border border-white/20 p-10 rounded-2xl shadow-2xl w-[360px] flex flex-col gap-4 text-white"
        >
          {/* Logo and title */}
          <div className="flex flex-col items-center mb-4">
            <Image
              src="/logo.png"
              alt="Logo"
              width={100}
              height={30}
              className="mb-2"
            />
            <h1 className="text-2xl font-bold text-white justify-center text-center">
              Institute Management System
            </h1>
            <p className="text-gray-400 text-sm mt-2">
              Sign in to access your dashboard
            </p>
          </div>

          {/* Clerk errors */}
          <Clerk.GlobalError className="text-sm text-red-400 text-center" />

          {/* Username */}
          <Clerk.Field name="identifier" className="flex flex-col gap-2">
            <Clerk.Label className="text-xs text-gray-400">Username</Clerk.Label>
            <Clerk.Input
              type="text"
              required
              className="p-2 rounded-md bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter your username"
            />
            <Clerk.FieldError className="text-xs text-red-400" />
          </Clerk.Field>

          {/* Password */}
          <Clerk.Field name="password" className="flex flex-col gap-2">
            <Clerk.Label className="text-xs text-gray-400">Password</Clerk.Label>
            <Clerk.Input
              type="password"
              required
              className="p-2 rounded-md bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="••••••••"
            />
            <Clerk.FieldError className="text-xs text-red-400" />
          </Clerk.Field>

          {/* Submit */}
          <SignIn.Action
            submit
            className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-semibold my-2 rounded-md text-sm py-2 transition-all duration-200"
          >
            Sign In
          </SignIn.Action>

          {/* Footer */}
          <p className="text-center text-xs text-gray-500 mt-2">
            © {new Date().getFullYear()} Powerd by Metagenious Technologies 
          </p>
          
          
        </SignIn.Step>
      </SignIn.Root>
    </div>
  );
};

export default LoginPage;
