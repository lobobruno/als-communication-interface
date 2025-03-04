import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const viewport: Viewport = {
	themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#202022" }],
	minimumScale: 1,
	initialScale: 1,
	maximumScale: 1,
	width: "device-width",
	height: "device-height",
};

export const metadata: Metadata = {
	title: "AL Voice",
	description:
		"An adaptive communication tool for ALS patients using eye-tracking and predictive text.",
	manifest: "/manifest.json",
	/*openGraph: {
		type: "website",
		images: [
			{
				url: "/img/simon-og-800x800.png",
				width: 800,
				height: 800,
				alt: "Simon Capital",
			},
		],
	},*/
	authors: [
		{ name: "Bruno Lobo" },
		{
			name: "Bruno Lobo",
			url: "https://www.x.com/brunowlf/",
		},
	],

	icons: [
		{
			rel: "apple-touch-icon",
			url: "/icon512_maskable.png",
		},
		{
			rel: "icon",
			url: "/icon512_maskable.png",
		},
	],
	appleWebApp: true,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				{children}
			</body>
		</html>
	);
}
