import type { StreamTranscriptItem } from "@/app/(dashboard)/meetings/lib/types";
import { Config } from "@/config/env";
import { db } from "@/db";
import { agents, meetings, user } from "@/db/schema";
import type { TextMessage } from "@inngest/agent-kit";
import { createAgent, openai } from "@inngest/agent-kit";
import { eq, inArray } from "drizzle-orm";
import JSONL from "jsonl-parse-stringify";
import { inngest } from "./client";

const summarizer = createAgent({
	name: "Summarizer",
	system:
		"You are a helpful assistant that summarizes the transcript of a meeting.",
	model: openai({ model: "gpt-4o-mini", apiKey: Config.OPENAI_API_KEY }),
});

export const meetingsProcessing = inngest.createFunction(
	{ id: "meetings-processing" },
	{ event: "meetings/processing" },
	async ({ event, step }) => {
		const response = await step.run("fetch-transcript", async () => {
			return fetch(event.data.transcriptUrl).then((res) => res.text());
		});

		const transcript = await step.run("parse-transcript", async () => {
			const jsonl = JSONL.parse<StreamTranscriptItem>(response);
			return jsonl;
		});

		const transcriptWithSpeakers = await step.run("add-speakers", async () => {
			const speakerIds = [
				...new Set(transcript.map((item) => item.speaker_id)),
			];
			const userSpeakers = await db
				.select()
				.from(user)
				.where(inArray(user.id, speakerIds))
				.then((user) => ({ ...user }));

			const agentSpeakers = await db
				.select()
				.from(agents)
				.where(inArray(agents.id, speakerIds))
				.then((agent) => ({ ...agent }));

			const speakers = [...userSpeakers, ...agentSpeakers];

			return transcript.map((item) => {
				const speaker = speakers.find(
					(speaker) => speaker.id === item.speaker_id,
				);

				if (!speaker) {
					return {
						...item,
						user: {
							name: "Unknown",
						},
					};
				}

				return {
					...item,
					speaker: speaker?.name,
				};
			});
		});

		const { output } = await summarizer.run(
			`Summarizr the following transcript: ${JSON.stringify(transcriptWithSpeakers)}`,
		);

		await step.run("save-summary", async () => {
			await db
				.update(meetings)
				.set({
					summary: (output[0] as TextMessage).content as string,
					status: "completed",
				})
				.where(eq(meetings.id, event.data.meetingId));
		});
	},
);
