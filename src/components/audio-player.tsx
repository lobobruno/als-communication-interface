"use client";
import type React from "react";
import { useState, useEffect } from "react";

const AudioPlayer: React.FC = () => {
	const [audioUrl, setAudioUrl] = useState<string | null>(null);

	useEffect(() => {
		// Set the URL to the API route we created
		setAudioUrl("/api/audio");
	}, []);

	return (
		<div>
			{audioUrl ? (
				// biome-ignore lint/a11y/useMediaCaption: <explanation>
				<audio controls src={audioUrl}>
					Your browser does not support the audio element.
				</audio>
			) : (
				<p>Loading audio...</p>
			)}
		</div>
	);
};
export default AudioPlayer;
