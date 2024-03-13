import React, { useState, useEffect } from 'react';
import '../CSS/Pomodoro.css';
import alarmSound from '../sounds/alarm.wav';
import { Popup } from 'reactjs-popup';

const Pomodoro = () => {
    const [timer, setTimer] = useState(1500); // Initial timer value: 25 minutes in seconds
    const [sessionCount, setSessionCount] = useState(0); // Track Pomodoro sessions
    const [timerType, setTimerType] = useState('Pomodoro'); // Initial timer type: work
    const [isRunning, setIsRunning] = useState(false); // Initial timer state: paused
    const [isSoundEnabled, setIsSoundEnabled] = useState(true); // Initial state for sound effect
    const [isTimerAutomatic, setIsTimerAutomatic] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [numShortBreaks, setNumShortBreaks] = useState(2);
    const [pomodoroDuration, setPomodoroDuration] = useState(25);
    const [shortBreakDuration, setShortBreakDuration] = useState(5);
    const [longBreakDuration, setLongBreakDuration] = useState(15);

    useEffect(() => {
        let intervalId;

        if (isRunning && !isPopupOpen) {
            intervalId = setInterval(() => {
                setTimer(prevTimer => {
                    if (prevTimer > 0) {
                        return prevTimer - 1;
                    } else {
                        if (isSoundEnabled) playSoundEffect();
                        // Timer reached zero, switch timer type and reset timer value
                        handleSkip();
                    }
                });
            }, 1000);
        } else {
            clearInterval(intervalId);
        }

        return () => clearInterval(intervalId); // Cleanup function to clear the interval
    }, [isRunning, timerType, isSoundEnabled, isPopupOpen]);


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
                if (sessionCount < numShortBreaks) {
                    setTimer(shortBreakDuration * 60); // 5 minutes for short break
                    setTimerType('Short Break');
                } else {
                    setTimer(longBreakDuration * 60);
                    setTimerType('Long Break');
                }
                break;
            case 'Short Break':
                setTimer(pomodoroDuration * 60); // 25 minutes for work
                setTimerType('Pomodoro');
                break;
            case 'Long Break':
                setTimer(pomodoroDuration * 60); // 25 minutes for work
                setTimerType('Pomodoro');
                break;
            default:
                break;
        }
        // Increment sessionCount if transitioning from a work session to a short break
        if (timerType === 'Pomodoro' && sessionCount < numShortBreaks) {
            setSessionCount(sessionCount + 1);
        }
        // Pause the timer
        if (!isTimerAutomatic) {
            setIsRunning(false);
        } else {
            setIsRunning(true);
        }
        // Check if we are transitioning to a long break and reset the session count
        if (timerType === 'Pomodoro' && sessionCount === numShortBreaks) {
            setSessionCount(0);
        }
    };

    const playSoundEffect = () => {
        // Create a new Audio object with the sound effect file
        const audio = new Audio(alarmSound);
        // Play the sound effect
        audio.play();
    };

    const handleSoundToggle = () => {
        setIsSoundEnabled(prevState => !prevState);
    };

    const handleAutomaticToggle = () => {
        setIsTimerAutomatic(prevState => !prevState);
    }

    const handleNumShortBreaksChange = (e) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value >= 1 && value <= 99) {
            setNumShortBreaks(value);
        }
    };

    const handlePomodoroDurationChange = (e) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value >= 1 && value <= 99) {
            setPomodoroDuration(value);
        }
    };

    const handleShortBreakDurationChange = (e) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value >= 1 && value <= 99) {
            setShortBreakDuration(value);
        }
    };

    const handleLongBreakDurationChange = (e) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value >= 1 && value <= 99) {
            setLongBreakDuration(value);
        }
    };

    // const handleExit = (closePopup) => {
    //     setSessionCount(0);
    //     setTimerType('Pomodoro');
    //     setTimer(pomodoroDuration * 60);
    //     setIsSoundEnabled(prevState => !prevState);
    //     setIsTimerAutomatic(prevState => !prevState);
    //     closePopup();
    // };

    return (
        <div className="pomodoro-section">
            <h2>{timerType} Timer</h2>
            <div className="timer">{formatTime(timer)}</div>
            <div className="buttons">
                <button onClick={handleStartPause}>{isRunning ? 'Pause' : 'Start'}</button>
                <button onClick={handleSkip}>Skip</button>
                <Popup trigger={<button> Settings </button>} modal nested closeOnDocumentClick onOpen={() => setIsPopupOpen(true)} onClose={() => setIsPopupOpen(false)}>
                    {close => (
                        <div className="popup-container">
                            <div className="popup-content">
                                <div className="popup-header">Settings
                                <div className="note-text">
                                    <label>
                                        (changes update next timer iteration)
                                    </label>
                                </div>
                                </div>
                                <div className="popup-main">
                                    <div>
                                        <label>
                                            Pomodoro Duration (minutes):
                                            <input type="number" value={pomodoroDuration} onChange={handlePomodoroDurationChange} />
                                        </label>
                                    </div>
                                    <div>
                                        <label>
                                            Short Break Duration (minutes):
                                            <input type="number" value={shortBreakDuration} onChange={handleShortBreakDurationChange} />
                                        </label>
                                    </div>
                                    <div>
                                        <label>
                                            Long Break Duration (minutes):
                                            <input type="number" value={longBreakDuration} onChange={handleLongBreakDurationChange} />
                                        </label>
                                    </div>
                                    <div>
                                        <label>
                                            Short to Long Break Ratio:
                                            <input type="number" value={numShortBreaks} onChange={handleNumShortBreaksChange} />
                                        </label>
                                    </div>
                                    <div>
                                        <label>
                                            Enable Alarm Sound: <input type="checkbox" checked={isSoundEnabled} onChange={handleSoundToggle} />
                                        </label>
                                    </div>
                                    <div>
                                        <label>
                                            Enable Automatic Timer Countdown: <input type="checkbox" checked={isTimerAutomatic} onChange={handleAutomaticToggle} />
                                        </label>
                                    </div>
                                </div>
                                <div className="popup-footer">
                                    <button className="popup-button" onClick={close}>Exit</button>
                                </div>
                            </div>
                        </div>
                    )}
                </Popup>
            </div>
        </div>
    );
}

export default Pomodoro;
