import type { Metadata } from "next";
import "./globals.css";
import { Poppins, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";

const poppins = Poppins({
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700"],
	variable: "--font-spaceGrotesk",
});

export const metadata: Metadata = {
	title: "DMS",
	description: "Document Management System",
	icons: {
		icon: "/assets/logo.svg",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className={`${poppins.variable} ${spaceGrotesk.variable}`}>
				<ThemeProvider
					attribute='class'
					defaultTheme='dark'
					disableTransitionOnChange
				>
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
