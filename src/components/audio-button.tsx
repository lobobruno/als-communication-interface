"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface PlayAudioButtonProps {
	text: string;
	audioSrc: string;
}

export const PlayAudioButton: React.FC<PlayAudioButtonProps> = ({
	text,
	audioSrc,
}) => {
	const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
	const [isPlaying, setIsPlaying] = useState(false);

	useEffect(() => {
		setAudio(new Audio(audioSrc));
	}, [audioSrc]); // Runs only when audioSrc changes

	const handleClick = () => {
		if (audio) {
			try {
				setIsPlaying(true);
				audio.currentTime = 0; // Restart audio if already playing
				audio.play();
			} catch (e) {
				console.error(e);
			} finally {
				setIsPlaying(false);
			}
		}
	};

	return (
		<Button
			size={"lg"}
			onClick={handleClick}
			disabled={isPlaying}
			variant={isPlaying ? "ghost" : "default"}
		>
			<span className="text-lg sm:text-xl">{text}</span>
		</Button>
	);
};
