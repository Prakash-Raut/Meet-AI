import { AlertCircleIcon } from "lucide-react";

type ErrorStateProps = {
	title: string;
	description: string;
};

export const ErrorState = ({ title, description }: ErrorStateProps) => {
	return (
		<div className="flex flex-1 items-center justify-center py-4 px-8">
			<div className="flex flex-col items-center justify-center gap-y-6 bg-background rounded-lg p-10 shadow-sm">
				<AlertCircleIcon className="size-6 text-red-500" />
				<h6 className="text-lg font-medium">{title}</h6>
				<p className="text-sm">{description}</p>
			</div>
		</div>
	);
};
