"use client";

import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import type { JSX } from "react";
import { useState } from "react";

export const useConfirm = (
	title: string,
	description: string,
): [() => JSX.Element, () => Promise<boolean>] => {
	const [promise, setPromise] = useState<{
		resolve: (value: boolean) => void;
	} | null>(null);

	const confirm = () => {
		return new Promise<boolean>((resolve) => {
			setPromise({ resolve });
		});
	};

	const handleClose = () => {
		setPromise(null);
	};

	const handleConfirm = () => {
		promise?.resolve(true);
		handleClose();
	};

	const handleCancel = () => {
		promise?.resolve(false);
		handleClose();
	};

	const ConfirmationDialog = () => (
		<ResponsiveDialog
			open={promise !== null}
			onOpenChange={handleClose}
			title={title}
			description={description}
		>
			<div className="flex w-full flex-col-reverse gap-2 pt-4 lg:flex-row items-center justify-end">
				<Button
					variant="outline"
					onClick={handleCancel}
					className="w-full lg:w-auto"
				>
					Cancel
				</Button>
				<Button onClick={handleConfirm} className="w-full lg:w-auto">
					Confirm
				</Button>
			</div>
		</ResponsiveDialog>
	);

	return [ConfirmationDialog, confirm];
};
