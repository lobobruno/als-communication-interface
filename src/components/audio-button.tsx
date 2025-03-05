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

	useEffect(() => {
		setAudio(new Audio(audioSrc));
	}, [audioSrc]); // Runs only when audioSrc changes

	const handleClick = () => {
		if (audio) {
			audio.currentTime = 0; // Restart audio if already playing
			audio.play();
		}
	};

	return (
		<Button size={"lg"} onClick={handleClick}>
			<span className="text-xl">{text}</span>
		</Button>
	);
};
