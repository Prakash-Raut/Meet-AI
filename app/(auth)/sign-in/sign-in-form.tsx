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

const signInFormSchema = z.object({
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
});

export function SignInForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);
	const [isPending, setIsPending] = useState(false);

	const form = useForm<z.infer<typeof signInFormSchema>>({
		resolver: zodResolver(signInFormSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const submitAction = (data: z.infer<typeof signInFormSchema>) => {
		setError(null);
		setIsPending(true);
		try {
			authClient.signIn.email(
				{
					email: data.email,
					password: data.password,
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
			<Card className="overflow-hidden">
				<CardContent className="grid p-0 md:grid-cols-2">
					<Form {...form}>
						<form
							className="p-6 md:p-8"
							onSubmit={form.handleSubmit(submitAction)}
						>
							<div className="flex flex-col gap-6">
								<div className="flex flex-col items-center text-center">
									<h1 className="text-2xl font-bold">Welcome back</h1>
									<p className="text-balance text-muted-foreground">
										Login to your Acme Inc account
									</p>
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
									<div className="flex items-end justify-end">
										<Link
											href="#"
											className="ml-auto text-sm underline-offset-2 hover:underline"
										>
											Forgot your password?
										</Link>
									</div>
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
								{!!error && (
									<Alert className="bg-destructive/10 border-none">
										<OctagonAlertIcon size={16} className="!text-destructive" />
										<AlertTitle>{error}</AlertTitle>
									</Alert>
								)}
								<Button disabled={isPending} type="submit" className="w-full">
									Sign in
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
										<span className="sr-only">Login with Apple</span>
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
									Don&apos;t have an account?{" "}
									<Link
										href="/sign-up"
										className="underline underline-offset-4"
									>
										Sign up
									</Link>
								</div>
							</div>
						</form>
					</Form>
					<div className="relative hidden bg-muted md:block">
						<Image
							src="/placeholder.svg"
							alt="Image"
							className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
							width={500}
							height={500}
						/>
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
