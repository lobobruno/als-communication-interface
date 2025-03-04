"use client";
import { ElevenLabsClient, play } from "elevenlabs";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Volume2, Play, Pause } from "lucide-react";

import { PlayAudioButton } from "@/components/audio-button";

export default function ALSCommunicationInterface() {
	const [message, setMessage] = useState("");
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
		null,
	);
	const [isPlaying, setIsPlaying] = useState(false);
	const [isGenarating, setIsGenarating] = useState(false);

	const handleSpeak2 = async () => {
		try {
			setIsGenarating(true);
			const response = await fetch("/api/text-to-speech", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					text: message,
					voiceId: null,
				}),
			});
			const data = await response.json();
			if (!response.ok) {
				throw new Error(data.error || "Erro ao buscar audio");
			}
			const audio = new Audio(`data:audio/mpeg;base64,${data.audioBase64}`);
			setAudioElement(audio);
			audio?.play();
			audio.onended = () => {
				setIsPlaying(false);
			};
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (err: any) {
			console.error(err);
			setError(err.message);
			failSafeSpeakMessage();
		} finally {
			setIsGenarating(false);
		}
	};

	const handlePlayPause = () => {
		if (!audioElement) return;
		if (isPlaying) {
			audioElement.pause();
		} else {
			audioElement.play();
		}
		setIsPlaying((p) => !p);
	};

	const actionsButtons = [
		{ txt: "Água", src: "/audio/agua.mp3" },
		{ txt: "Fome", src: "/audio/fome.mp3" },
		{ txt: "Sim", src: "/audio/sim.mp3" },
		{ txt: "Não", src: "/audio/nao.mp3" },
	];

	// Function to speak the message using text-to-speech
	const failSafeSpeakMessage = () => {
		if (!message) return;

		// Check if speech synthesis is available
		if ("speechSynthesis" in window) {
			const utterance = new SpeechSynthesisUtterance(message);
			utterance.rate = 0.9; // Slightly slower rate for clarity
			utterance.pitch = 1;
			utterance.lang = "pt-BR";
			window.speechSynthesis.speak(utterance);
		}
	};

	// Clear the message
	const clearMessage = () => {
		setMessage("");
		if (textareaRef.current) {
			textareaRef.current.focus();
		}
	};

	return (
		<div className="min-h-screen p-4 bg-gray-50">
			<Card className="max-w-4xl mx-auto shadow-lg">
				<CardHeader className="">
					<CardTitle className="text-2xl font-bold text-primary text-center">
						ALVoice
					</CardTitle>
				</CardHeader>
				<CardContent className="p-6">
					{/* Message input area */}
					<div className="space-y-4">
						<Textarea
							ref={textareaRef}
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							placeholder="Type your message here..."
							className="w-full min-h-[150px] text-xl p-4 border-2 focus:border-primary"
							aria-label="Message input"
						/>

						<div className="flex flex-wrap gap-3 justify-end">
							<Button
								variant="outline"
								size="lg"
								onClick={clearMessage}
								className="text-lg"
							>
								Limpar
							</Button>
							<Button
								//onClick={speakMessage}
								onClick={handleSpeak2}
								size="lg"
								className="gap-2 text-lg"
								disabled={!message}
							>
								<Volume2 className="h-5 w-5" />
								Falar
							</Button>
							{audioElement && (
								<Button
									onClick={handlePlayPause}
									size="lg"
									className="gap-2 text-lg"
								>
									{isPlaying ? (
										<Pause className="h-5 w-5" />
									) : (
										<Play className="h-5 w-5" />
									)}
								</Button>
							)}
						</div>
					</div>

					{/* Quick access buttons */}
					<div className="mt-8">
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							{actionsButtons.map((e, index) => (
								<PlayAudioButton
									key={`btn-${e.txt}-${index}`}
									text={e.txt}
									audioSrc={e.src}
								/>
							))}
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
