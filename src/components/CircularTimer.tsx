import React, { useEffect, useState } from 'react';

interface CircularTimerProps {
    duration: number; // Duration in seconds
    onComplete: () => void;
    size?: number;
    strokeWidth?: number;
    className?: string;
}

const CircularTimer: React.FC<CircularTimerProps> = ({
    duration,
    onComplete,
    size = 60,
    strokeWidth = 4,
    className = ''
}) => {
    const [timeLeft, setTimeLeft] = useState(duration);
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const progress = (timeLeft / duration) * circumference;

    useEffect(() => {
        if (timeLeft <= 0) {
            onComplete();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => Math.max(0, prev - 1));
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, onComplete]);

    return (
        <div className={`relative inline-block ${className}`}>
            <svg width={size} height={size} className="transform -rotate-90">
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#000044"
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                {/* Progress circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#3B82F6"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - progress}
                    className="transition-all duration-1000 ease-linear"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                {timeLeft}s
            </div>
        </div>
    );
};

export default CircularTimer; 