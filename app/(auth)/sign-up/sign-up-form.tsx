"use client";

import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { OctagonAlertIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { toast } from "sonner";
import { z } from "zod";

const signUpFormSchema = z
	.object({
		name: z.string().min(1, {
			message: "Name is required",
		}),
		email: z.string().email(),
		password: z
			.string()
			.min(1, {
				message: "Password is required",
			})
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
				{
					message:
						"Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
				},
			),
		confirmPassword: z.string().min(1, {
			message: "Confirm password is required",
		}),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export function SignUpForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);
	const [isPending, setIsPending] = useState(false);

	const form = useForm<z.infer<typeof signUpFormSchema>>({
		resolver: zodResolver(signUpFormSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	const submitAction = (data: z.infer<typeof signUpFormSchema>) => {
		setError(null);
		setIsPending(true);
		try {
			setIsPending(true);
			authClient.signUp.email(
				{
					name: data.name,
					email: data.email,
					password: data.password,
					callbackURL: "/",
				},
				{
					onSuccess: () => {
						toast.success("Signed up");
					},
					onError: ({ error }) => {
						setError(error.message);
					},
				},
			);
		} catch (error) {
			setError("Something went wrong, please try again.");
		} finally {
			setIsPending(false);
		}
	};

	const handleSocialSignIn = (provider: "google" | "github") => {
		setError(null);
		setIsPending(true);
		try {
			authClient.signIn.social(
				{
					provider: provider,
					callbackURL: "/",
				},
				{
					onSuccess: () => {
						toast.success("Signed in");
						router.push("/");
					},
					onError: ({ error }) => {
						setError(error.message);
					},
				},
			);
		} catch (error) {
			setError("Invalid credentials");
		} finally {
			setIsPending(false);
		}
	};

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card className="overflow-hidden py-0">
				<CardContent className="grid p-0 md:grid-cols-2">
					<Form {...form}>
						<form
							className="p-6 md:p-8"
							onSubmit={form.handleSubmit(submitAction)}
						>
							<div className="flex flex-col gap-6">
								<div className="flex flex-col items-center text-center">
									<h1 className="text-2xl font-bold">Let&apos;s get started</h1>
									<p className="text-balance text-muted-foreground">
										Create your account
									</p>
								</div>
								<div className="grid gap-2">
									<FormField
										control={form.control}
										name="name"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Name</FormLabel>
												<FormControl>
													<Input placeholder="John Doe" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<div className="grid gap-2">
									<FormField
										control={form.control}
										name="email"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Email</FormLabel>
												<FormControl>
													<Input placeholder="m@example.com" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<div className="grid gap-2">
									<FormField
										control={form.control}
										name="password"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Password</FormLabel>
												<FormControl>
													<Input
														placeholder="********"
														{...field}
														type="password"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<div className="grid gap-2">
									<FormField
										control={form.control}
										name="confirmPassword"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Confirm Password</FormLabel>
												<FormControl>
													<Input
														placeholder="********"
														{...field}
														type="password"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								{!!error && (
									<Alert className="bg-destructive/10 border-none">
										<OctagonAlertIcon size={16} className="!text-destructive" />
										<AlertTitle>{error}</AlertTitle>
									</Alert>
								)}
								<Button disabled={isPending} type="submit" className="w-full">
									Sign up
								</Button>
								<div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
									<span className="relative z-10 bg-background px-2 text-muted-foreground">
										Or continue with
									</span>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<Button
										variant="outline"
										className="w-full"
										onClick={() => handleSocialSignIn("github")}
									>
										<FaGithub size={16} />
										<span className="sr-only">Login with Github</span>
									</Button>
									<Button
										variant="outline"
										className="w-full"
										onClick={() => handleSocialSignIn("google")}
									>
										<FaGoogle size={16} />
										<span className="sr-only">Login with Google</span>
									</Button>
								</div>
								<div className="text-center text-sm">
									Already have an account?{" "}
									<Link
										href="/sign-in"
										className="underline underline-offset-4"
									>
										Sign in
									</Link>
								</div>
							</div>
						</form>
					</Form>
					<div className="bg-radial from-sidebar-accent to-sidebar relative hidden md:flex flex-col gap-y-4 items-center justify-center">
						<Image
							src="/logo.svg"
							alt="Image"
							className=""
							width={92}
							height={92}
						/>
						<p className="text-2xl font-semibold text-white">Meet.AI</p>
					</div>
				</CardContent>
			</Card>
			<div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
				By clicking continue, you agree to our{" "}
				<Link href="#">Terms of Service</Link> and{" "}
				<Link href="#">Privacy Policy</Link>.
			</div>
		</div>
	);
}
