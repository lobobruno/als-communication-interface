import { type NextRequest, NextResponse } from "next/server";

const VOICE_ID = process.env.VOICE_ID;
const VOICE_SPEED = process.env.VOICE_SPEED || 0.8;
const VOICE_SIMILARITY_BOOST = process.env.VOICE_SIMILARITY_BOOST || 0.9;
const VOICE_STABILITY = process.env.VOICE_STABILITY || 0.6;
const VOICE_MODEL = process.env.VOICE_MODEL || "eleven_multilingual_v2";

export async function POST(request: NextRequest) {
	try {
		// Extract text and voiceId from the request body
		const { text, voiceId } = await request.json();

		// Validate that text and voiceId are provided
		if (!text) {
			return NextResponse.json({ error: "Missing text" }, { status: 400 });
		}

		// Retrieve the ElevenLabs API key from environment variables
		const apiKey = process.env.ELEVENLABS_API_KEY;
		if (!apiKey) {
			return NextResponse.json(
				{ error: "API key not configured" },
				{ status: 500 },
			);
		}

		// Make a POST request to the ElevenLabs text-to-speech API
		const response = await fetch(
			`https://api.elevenlabs.io/v1/text-to-speech/${voiceId || VOICE_ID}`,
			{
				method: "POST",
				headers: {
					Accept: "audio/mpeg",
					"Content-Type": "application/json",
					"xi-api-key": apiKey,
				},
				body: JSON.stringify({
					text,
					model_id: VOICE_MODEL,
					voice_settings: {
						stability: VOICE_STABILITY,
						similarity_boost: VOICE_SIMILARITY_BOOST,
						speed: VOICE_SPEED,
					},
				}),
			},
		);

		// Check if the API response is successful
		if (!response.ok) {
			const errorData = await response.json();
			return NextResponse.json(
				{ error: errorData },
				{ status: response.status },
			);
		}

		// Convert the audio response to a base64-encoded string
		const audioBuffer = await response.arrayBuffer();
		const audioBase64 = Buffer.from(audioBuffer).toString("base64");

		// Return the base64-encoded audio data
		return NextResponse.json({ audioBase64 });
	} catch (error) {
		// Log and handle any unexpected errors
		console.error("Error in text-to-speech API:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function GET() {
	return NextResponse.json({ message: "NO GET HERE!" });
}
