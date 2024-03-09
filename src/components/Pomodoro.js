import React, { useState, useEffect } from 'react';

const Pomodoro = () => {
    const [timer, setTimer] = useState(1500); // Initial timer value: 25 minutes in seconds
    const [sessionCount, setSessionCount] = useState(0); // Track Pomodoro sessions
    const [timerType, setTimerType] = useState('Pomodoro'); // Initial timer type: work
    const [isRunning, setIsRunning] = useState(false); // Initial timer state: paused

    useEffect(() => {
        let intervalId;

        if (isRunning) {
            intervalId = setInterval(() => {
                setTimer(prevTimer => {
                    if (prevTimer > 0) {
                        return prevTimer - 1;
                    } else {
                        // Timer reached zero, switch timer type and reset timer value
                        switch (timerType) {
                            case 'Pomodoro':
                                setTimer(2500); // 25 minutes for work
                                setSessionCount(prevCount => {
                                    if (prevCount === 3) {
                                        setTimerType('Long Break');
                                        return 0; // Reset session count
                                    } else {
                                        setTimerType('Short Break');
                                        return prevCount + 1;
                                    }
                                });
                                break;
                            case 'Short Break':
                                setTimer(300); // 5 minutes for short break
                                setTimerType('Pomodoro');
                                break;
                            case 'Long Break':
                                setTimer(1500); // 15 minutes for long break
                                setTimerType('Pomodoro');
                                break;
                            default:
                                break;
                        }
                    }
                });
            }, 1000);
        } else {
            clearInterval(intervalId);
        }

        return () => clearInterval(intervalId);
    }, [isRunning, timerType]);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleStartPause = () => {
        setIsRunning(prevState => !prevState);
    };

    const handleSkip = () => {
        // Reset timer to zero to trigger timer type switch
        setTimer(0);
    };

    return (
        <div className="pomodoro">
            <h2>{timerType} Timer</h2>
            <div className="timer">{formatTime(timer)}</div>
            <div className="buttons">
                <button onClick={handleStartPause}>{isRunning ? 'Pause' : 'Start'}</button>
                <button onClick={handleSkip}>Skip</button>
            </div>
        </div>
    );
}

export default Pomodoro;
