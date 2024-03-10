import React, { useState, useEffect } from 'react';
import '../CSS/Pomodoro.css';
import alarmSound from '../sounds/alarm.wav';

const Pomodoro = () => {
    const [timer, setTimer] = useState(15); // Initial timer value: 25 minutes in seconds
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
                        playSoundEffect();
                        // Timer reached zero, switch timer type and reset timer value
                        handleSkip();
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
        // Reset timer to the starting value of the next timer in the cycle
        switch (timerType) {
            case 'Pomodoro':
                if (sessionCount < 2) {
                    setTimer(3); // 5 minutes for short break
                    setTimerType('Short Break');
                } else {
                    setTimer(9);
                    setTimerType('Long Break');
                }
                break;
            case 'Short Break':
                setTimer(15); // 25 minutes for work
                setTimerType('Pomodoro');
                break;
            case 'Long Break':
                setTimer(15); // 25 minutes for work
                setTimerType('Pomodoro');
                break;
            default:
                break;
        }
        // Increment sessionCount if transitioning from a work session to a short break
        if (timerType === 'Pomodoro' && sessionCount < 2) {
            setSessionCount(sessionCount + 1);
        }
        // Pause the timer
        setIsRunning(false);
        // Check if we are transitioning to a long break and reset the session count
        if (timerType === 'Pomodoro' && sessionCount === 2) {
            setSessionCount(0);
        }
    };

    const playSoundEffect = () => {
        // Create a new Audio object with the sound effect file
        const audio = new Audio(alarmSound);
        // Play the sound effect
        audio.play();
    };

    return (
        <div className="pomodoro-section">
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
