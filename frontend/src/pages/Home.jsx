import { useState } from "react";
import { About } from "./../components/About.jsx"
import { HowToPlay } from "./../components/HowToPlay.jsx"
import { PlayGame } from "./../components/PLayGame.jsx"

export const Home = () => {
    
    return (
        <div className="relative w-screen h-screen overflow-hidden">
            <div className="absolute inset-0 bg-[url(./Sketch.jpeg)] bg-no-repeat -translate-x-4 -translate-y-4 bg-cover opacity-25 -z-10" />
            <header className="px-8 pt-6 pb-12">
                <div 
                    className="mx-auto text-center transition-transform duration-300 cursor-pointer hover:scale-105"
                >
                    <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500">
                        SketchNSnort
                    </h1>
                    <p className="mt-2 text-lg text-gray-600">Draw, Guess, Laugh, Repeat!</p>
                </div>
            </header>
                <div className="flex flex-wrap items-stretch justify-between gap-4">
                    <About />
                    <PlayGame />
                    <HowToPlay />
                </div>
            <footer className="absolute bottom-0 left-0 right-0 py-4 text-sm text-center text-gray-500">
                <p>© 2025 SketchNSnort Game | Connect with friends and draw together</p>
            </footer>
        </div>
    );
};