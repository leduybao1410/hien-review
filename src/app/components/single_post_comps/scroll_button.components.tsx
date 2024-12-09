'use client'
import React from 'react';

const ScrollButton = ({ targetId, label, item }: { targetId: string, label: string, item?: any }) => {
    const handleClick = () => {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            const yOffset = -100;
            const y = targetElement.getBoundingClientRect().top + window.scrollY + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    return (
        <button onClick={handleClick} className="px-4 py-2 bg text-black text-left rounded-lg hover:text-blue-700 transition">
            {item?.level === 1 && <span className="text-xl font-bold">{label}</span>}
            {item?.level === 2 && <span className="text-lg font-normal">{label}</span>}
            {label === 'Video Youtube' && <span className="text-lg font-bold bg-red-500 text-white rounded-lg px-2 py-2">{label}</span>}
        </button>
    );
};

export default ScrollButton;
