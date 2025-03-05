"use client";
import { ElevenLabsClient, play } from "elevenlabs";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle, Pause, Play, Volume2 } from "lucide-react";
import { useRef, useState } from "react";

import { PlayAudioButton } from "@/components/audio-button";
import { cn } from "@/lib/utils";

interface AudioData {
	audio: HTMLAudioElement;
	text: string;
}

export default function ALSCommunicationInterface() {
	const [message, setMessage] = useState("");
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const [error, setError] = useState<string | null>(null);

	const [audioElements, setAudioElements] = useState<AudioData[]>([]);
	const audioElement = audioElements[0]?.audio;

	const [isPlaying, setIsPlaying] = useState(false);
	const [isGenarating, setIsGenarating] = useState(false);

	const handleSpeak2 = async () => {
		try {
			setIsGenarating(true);
			const audioExists = audioElements.find((a) => a.text === message);
			if (audioExists) {
				audioExists.audio.play();
				setIsPlaying(true);
				setIsGenarating(false);
				return;
			}

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
			setAudioElements((p) => [...p.slice(-3), { audio, text: message }]);
			audio?.play();
			setIsPlaying(true);
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

	const handlePlayPause = (audio: HTMLAudioElement) => {
		if (!audio) return;
		if (isPlaying) {
			audio.pause();
		} else {
			audio.play();
		}
		setIsPlaying((p) => !p);
	};

	const actionsButtons = [
		[
			{ txt: "Sede", src: "/audio/sede.mp3" },
			{ txt: "Fome", src: "/audio/fome.mp3" },
			{ txt: "Calor", src: "/audio/calor.mp3" },
			{ txt: "Frio", src: "/audio/frio.mp3" },
		],
		[
			{ txt: "Barulho", src: "/audio/barulho.mp3" },
			{ txt: "Dor", src: "/audio/dor.mp3" },
			{ txt: "Dor (Peito)", src: "/audio/dor-peito.mp3" },
			{ txt: "Falta de Ar", src: "/audio/falta-ar.mp3" },
		],
		[
			{ txt: "Banheiro", src: "/audio/banheiro.mp3" },
			{ txt: "Deitar", src: "/audio/deitar.mp3" },
			{ txt: "Sentar", src: "/audio/sentar.mp3" },
			{ txt: "Levantar", src: "/audio/levantar.mp3" },
			{ txt: "Posição", src: "/audio/posicao.mp3" },
		],
		[
			{ txt: "Sim", src: "/audio/sim.mp3" },
			{ txt: "Não", src: "/audio/nao.mp3" },
		],
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
								disabled={!message || isGenarating}
							>
								{isGenarating ? (
									<LoaderCircle className="h-5 w-5 spin" />
								) : (
									<Volume2 className="h-5 w-5" />
								)}
								Falar
							</Button>
							{audioElement && (
								<Button
									onClick={() => handlePlayPause(audioElement)}
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
						<div
							className={cn("grid  gap-4", {
								"grid-cols-2": actionsButtons.length === 2,
								"grid-cols-3": actionsButtons.length === 3,
								"grid-cols-4": actionsButtons.length === 4,
							})}
						>
							{actionsButtons.map((g, index) => (
								<div
									className="flex flex-col gap-3 justify-start"
									key={`group-${
										// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
										index
									}`}
								>
									{g.map((e, index) => (
										<PlayAudioButton
											key={`btn-${e.txt}-${index}`}
											text={e.txt}
											audioSrc={e.src}
										/>
									))}
								</div>
							))}
						</div>
					</div>
					<div className="mt-20">
						<div className={cn("grid  gap-4")}>
							{audioElements.toReversed().map((e, index) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								<div key={`audio-${index}`} className="grid grid-cols-8 gap-4">
									<p className="col-span-7 truncate">{e.text}</p>
									<Button
										onClick={() => handlePlayPause(e.audio)}
										size="lg"
										className="gap-2 text-lg max-w-[50px]"
									>
										{isPlaying ? (
											<Pause className="h-5 w-5" />
										) : (
											<Play className="h-5 w-5" />
										)}
									</Button>
								</div>
							))}
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
