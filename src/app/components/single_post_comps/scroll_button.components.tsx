'use client'
import React from 'react';

const ScrollButton = ({ targetId, label, item, fontSize = 'md', isActive = false }: { targetId: string, label: string, item?: any, fontSize?: string, isActive?: boolean }) => {
    const handleClick = () => {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            const yOffset = -100;
            const y = targetElement.getBoundingClientRect().top + window.scrollY + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    return (
        <button onClick={handleClick} className={`${item?.level === 1 ? 'ml-0' : item?.level === 2 ? 'ml-4' : 'ml-8'} px-4 py-2 text-black text-left rounded-lg hover:text-blue-700 transition duration-300 ${isActive ? 'bg-blue-500 text-white' : ''}`}>
            {item?.level === 1 && <span className={`text-${fontSize} font-bold`}>{label}</span>}
            {item?.level === 2 && <span className={`text-${fontSize} font-normal`}>{label}</span>}
            {item?.level === 3 && <span className={`text-${fontSize} font-normal`}>{label}</span>}
            {label === 'Video Youtube' && <span className="text-lg font-bold bg-red-500 text-white rounded-lg px-2 py-2">{label}</span>}
        </button>
    );
};

export default ScrollButton;
