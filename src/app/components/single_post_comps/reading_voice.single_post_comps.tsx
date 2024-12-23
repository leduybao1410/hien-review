"use client"
import React, { useState, useEffect } from 'react';
import { FiPause, FiPlay, FiVolume } from 'react-icons/fi';

const ReadingVoice: React.FC<{ text: string }> = ({ text }) => {
    const cleanText = text.replace(/<[^>]*>/g, '');
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);
    const [duration, setDuration] = useState<number | null>(null);
    const [rate, setRate] = useState(1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [chartIndex, setChartIndex] = useState(0);
    const [cumulativeIndex, setCumulativeIndex] = useState(0);

    const calculateDuration = (text: string) => {
        const words = text.split(/\s+/).filter(word => word.trim() !== '');
        const averageWordsPerMinute = 200; // Average words per minute for reading speed
        const minutes = Math.ceil(words.length / averageWordsPerMinute);
        return minutes;
    };

    function setupUtterance(text: string, rate: number) {
        const utter = new SpeechSynthesisUtterance(text);

        utter.lang = 'vi-VN'; // Set language to Vietnamese
        utter.rate = rate;
        utter.onstart = () => setIsSpeaking(true);
        utter.onend = () => setIsSpeaking(false);
        utter.onboundary = (event) => {
            if (event.charIndex !== undefined) {
                setChartIndex(event.charIndex);
            }
        };
        setUtterance(utter);
        return utter;
    }

    useEffect(() => {
        const synth = window.speechSynthesis;
        // Remove HTML tags from the text

        setupUtterance(cleanText, rate);
        setDuration(calculateDuration(cleanText));

        return () => {
            synth.cancel(); // Clean up on component unmount
        };
    }, [text]);


    useEffect(() => {
        console.log(getPercentage(), "%");
    }, [chartIndex]);

    useEffect(() => {
        if (utterance && isPlaying) {
            setCumulativeIndex(chartIndex + cumulativeIndex);
            window.speechSynthesis.cancel(); // Stop the current speech
            const newText = cleanText.slice(chartIndex);
            const utter = setupUtterance(newText, rate);
            setUtterance(utter);
        }
    }, [rate]);

    useEffect(() => {
        if (utterance && isSpeaking) {
            window.speechSynthesis.speak(utterance);
        }
        return () => {
            window.speechSynthesis.cancel();
        }
    }, [utterance]);

    const handlePlayPause = () => {
        if (!utterance) return;

        if (!isPlaying) {
            setIsPlaying(true);
        }

        const synth = window.speechSynthesis;
        if (isSpeaking) {
            if (isPaused) {
                synth.resume();
                setIsPaused(false);
            } else {
                synth.pause();
                setIsPaused(true);
            }
        } else {
            synth.speak(utterance);
            setIsSpeaking(true);
            setIsPaused(false);
        }
    };

    function getPercentage() {
        const percentage = Math.round((cumulativeIndex + chartIndex) / cleanText.length * 100);
        return percentage > 100 ? 100 : percentage < 0 ? 0 : percentage;
    }

    return (
        <div className="flex md:flex-row flex-col justify-between items-center">
            <div className='flex md:flex-row flex-col items-center'>
                <p className='mr-2 font-bold'>Nghe đọc bài viết:</p>

                {utterance && (
                    <div className='flex flex-row items-center space-x-2 '>
                        <div className="flex items-center min-w-[200px] w-full relative border-2 border-gray-300 rounded-full overflow-hidden bg-gray-200">
                            <div style={{ width: `${getPercentage()}%` }} className="h-[25px] bg-gray-900 rounded-full"></div>
                            <p className={`${getPercentage() > 45 ? 'text-white' : 'text-gray-900'} font-semibold text-center absolute w-full`}>
                                {getPercentage()}%
                            </p>
                        </div>
                        <button name='phát-dừng' className={`text-xl flex items-center justify-center border-2 border-gray-300 w-10 h-10 rounded-full `} onClick={handlePlayPause}>
                            <span className='text-center'>
                                {(isSpeaking && !isPaused) ? <FiPause /> : <FiPlay />}
                            </span>
                        </button>
                        <button name='tốc độ' className='text-lg flex items-center justify-center border-2 border-gray-300 w-10 h-10 rounded-full' onClick={() => setRate(rate < 2 ? rate + 0.5 : 1)}>
                            <span className='text-center font-semibold'>
                                {rate}X
                            </span>
                        </button>
                    </div>
                )}
            </div>
            <div>
                <p> Thời lượng đọc: <span className='font-semibold'>{duration} phút</span> </p>
            </div>
        </div>
    );
};

export default ReadingVoice;
