"use client";
import React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = () => {
	const { theme, setTheme } = useTheme();

	return (
		<button
			onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
			className='relative p-2 hover:bg-gray-100 dark:hover:bg-[#1F1F23] rounded-full transition-colors'
		>
			<Sun className='h-5 w-5 text-gray-600 dark:text-gray-300 transition-all dark:hidden' />
			<Moon className='h-5 w-5 text-gray-600 dark:text-gray-300 transition-all hidden dark:block' />
			<span className='sr-only'>Toggle theme</span>
		</button>
	);
};

export default ThemeToggle;
