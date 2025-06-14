import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/client";
import { NuqsAdapter } from "nuqs/adapters/next";
import { Toaster } from "sonner";

import "./globals.css";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Meet AI",
	description: "Meet AI",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<NuqsAdapter>
			<TRPCReactProvider>
				<html lang="en">
					<body className={`${inter.variable} antialiased`}>
						<Toaster />
						{children}
					</body>
				</html>
			</TRPCReactProvider>
		</NuqsAdapter>
	);
}
