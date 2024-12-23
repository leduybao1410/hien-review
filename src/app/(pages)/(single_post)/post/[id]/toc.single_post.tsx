'use client'
import ScrollButton from '@/app/components/single_post_comps/scroll_button.components';
import React, { useEffect, useState, useRef } from 'react';

const TOCSinglePost = ({ toc }: { toc: Array<any> }) => {

    const getPositionY = (text: string) => {
        const elements = Array.from(document.querySelectorAll('h1, h2, h3'));
        const element = elements.find(el => el.innerHTML?.includes(text));
        if (element !== undefined) {
            return Math.floor(element.getBoundingClientRect().top - 20);
        }
        return 0;
    }
    const [headingPositionArray, setHeadingPositionArray] = useState<any[]>([]);
    const [currentHeading, setCurrentHeading] = useState<any>(null);
    const tocRefs = useRef<(HTMLLIElement | null)[]>([]);

    useEffect(() => {
        toc.map((element: any) => {
            const item = {
                text: element.text,
                positionY: getPositionY(element.text)
            }
            headingPositionArray.push(item);
        });
    }, [toc])

    function getClosestHeadingPosition(currentPosition: number) {
        if (headingPositionArray.length === 0) return null;
        const closest = headingPositionArray.reduce((prev, curr) => {
            return (Math.abs(curr.positionY - currentPosition) < Math.abs(prev.positionY - currentPosition) ? curr : prev);
        });
        return closest.text;
    }

    useEffect(() => {
        const handleScroll = () => {
            const currentPosition = Math.floor(window.scrollY);
            const closestHeading = getClosestHeadingPosition(currentPosition);
            setCurrentHeading(closestHeading);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [headingPositionArray]);

    useEffect(() => {
        const activeIndex = toc.findIndex(item => item.text === currentHeading);
        if (activeIndex !== -1 && tocRefs.current[activeIndex]) {
            tocRefs.current[activeIndex]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, [currentHeading]);

    return (
        <div id="toc-container" className="max-h-[250px] overflow-y-auto flex flex-col items-start justify-start">
            <ul className="list-none p-0 text-sm">
                {toc.map((item: any, index: any) => (
                    <li
                        key={index}
                        ref={el => {
                            if (el) {
                                tocRefs.current[index] = el;
                            }
                        }}
                        className={`ml-0 text-sm`}
                    >
                        <ScrollButton targetId={`heading-${index}`} item={item} isActive={currentHeading === item.text} label={item.text} fontSize="md" />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TOCSinglePost;
