import React, { useEffect, useRef } from 'react';

const SkillBar = ({ lang, percent }) => {
    const progressRef = useRef(null);
    const containerRef = useRef(null);
    const animatedRef = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animatedRef.current) {
                    progressRef.current.style.width = `${percent}%`;
                    progressRef.current.style.opacity = 1;
                    animatedRef.current = true;
                }
            });
        }, { threshold: 0.5 });

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, [percent]);

    return (
        <div className="mb-6" ref={containerRef}>
            <div className="flex justify-between mb-2">
                <span className="font-medium text-lg">{lang}</span>
                <span className="font-medium text-lg">{percent}%</span>
            </div>
            <div className="h-4 bg-white rounded-full overflow-hidden border-2 border-black shadow-md">
                <div
                    ref={progressRef}
                    className="h-full bg-black transition-all duration-500 ease-out opacity-0"
                    style={{ width: '0%' }}
                />
            </div>
        </div>
    );
};

export default SkillBar;