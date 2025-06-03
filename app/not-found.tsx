import Link from "next/link";

export default function NotFound() {
	return (
		<div className="flex flex-col items-center justify-center h-screen">
			<h1 className="text-4xl font-bold">404 - Page Not Found</h1>
			<Link href="/" className="text-blue-500 hover:text-blue-600">
				Go to Home
			</Link>
		</div>
	);
}
