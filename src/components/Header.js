import React, { useState } from 'react';
import '../CSS/Header.css';
import PropTypes from 'prop-types';
import axios from 'axios';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';

const Header = ({ onLoginSuccess, onLogout, loggedIn, loggedInUsername, setLoggedIn, setLoggedInUsername }) => {
    const [signUpUsername, setSignUpUsername] = useState('');
    const [signUpPassword, setSignUpPassword] = useState('');
    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    const handleSignUp = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        // Reset input fields
        setSignUpUsername('');
        setSignUpPassword('');
        try {
            // Check password length
            if (signUpPassword.length < 8 || signUpPassword.length > 64) {
                alert('Password must be between 8 and 64 characters long.');
                return;
            }
            if (signUpUsername.length > 15) {
                alert('Username can be at most 15 characters long.');
                return;
            }
            await axios.post('https://scheduling-strategizer-server.onrender.com/api/signup', { username: signUpUsername, password: signUpPassword });
            alert('Sign up successful!');
        } catch (error) {
            if (error.response && error.response.status === 409) {
                alert('Username already exists. Please choose another username.');
            } else {
                alert('Sign up failed.');
            }
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault(); 
        try {
            const response = await axios.post('https://scheduling-strategizer-server.onrender.com/api/login', { username: loginUsername, password: loginPassword });
            if (response.data.success) {
                onLoginSuccess(loginUsername);
                //alert('Login successful!');
                // Reset input fields
                setLoginUsername("");
                setLoginPassword("");
            } else {
                alert('Invalid username or password.');
            }
        } catch (error) {
            alert('Login failed.');
        }
    };

    const handleLogout = () => {
        onLogout();
        setLoggedIn(false);
        setLoggedInUsername('');
        sessionStorage.removeItem("loggedIn");
        sessionStorage.removeItem("loggedInUsername");
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('Are you sure you want to delete your account?')) {
            try {
                await axios.post('https://scheduling-strategizer-server.onrender.com/api/deleteAccount', { username: sessionStorage.getItem('loggedInUsername') });
                handleLogout();
                alert('Account deleted.');
            } catch (error) {
                console.error('Error deleting account:', error);
                alert('Failed to delete account. Please try again later.');
            }
        }
    };

    return (
        <header>
            <h1>Scheduling Strategizer</h1>
            <div className="authentication">
                {loggedIn ? (
                    <div>
                        <div className="welcome-text">Welcome, {loggedInUsername}</div>
                        <button className="delete-button" onClick={handleDeleteAccount}>Delete Account</button>
                        <button className="button" onClick={handleLogout}>Log out</button>
                    </div>
                ) : (
                    <div>
                        <Dialog.Root>
                            <Dialog.Trigger as="button" className="button">Sign up</Dialog.Trigger>
                            <Dialog.Portal>
                                <Dialog.Overlay className="DialogOverlay" />
                                <Dialog.Content className="DialogContent">
                                    <Dialog.Title className="DialogTitle">Sign up</Dialog.Title>
                                    <Dialog.Description className="DialogDescription">
                                        Enter your username and password to sign up. <br/>
                                        Your password must be at least 8 characters long.
                                    </Dialog.Description>
                                    <form onSubmit={handleSignUp}>
                                        <fieldset className="Fieldset">
                                            <label className="Label" htmlFor="signUpUsername">
                                                Username
                                            </label>
                                            <input
                                                className="Input"
                                                id="signUpUsername"
                                                type="text"
                                                placeholder="Username"
                                                value={signUpUsername}
                                                onChange={(e) => setSignUpUsername(e.target.value)}
                                                required
                                            />
                                        </fieldset>
                                        <fieldset className="Fieldset">
                                            <label className="Label" htmlFor="signUpPassword">
                                                Password
                                            </label>
                                            <input
                                                className="Input"
                                                id="signUpPassword"
                                                type="password"
                                                placeholder="Password"
                                                value={signUpPassword}
                                                onChange={(e) => setSignUpPassword(e.target.value)}
                                                required
                                            />
                                        </fieldset>
                                        <button type="submit" className="Button green">Sign up</button>
                                    </form>
                                    <Dialog.Close asChild>
                                        <button className="IconButton" aria-label="Close" onClick={() => {
                                            setSignUpUsername('');
                                            setSignUpPassword('');
                                        }}>
                                            <Cross2Icon />
                                        </button>
                                    </Dialog.Close>
                                </Dialog.Content>
                            </Dialog.Portal>
                        </Dialog.Root>
                        <Dialog.Root>
                            <Dialog.Trigger as="button" className="button">Log in</Dialog.Trigger>
                            <Dialog.Portal>
                                <Dialog.Overlay className="DialogOverlay" />
                                <Dialog.Content className="DialogContent">
                                    <Dialog.Title className="DialogTitle">Log in</Dialog.Title>
                                    <Dialog.Description className="DialogDescription">
                                        Enter your username and password to log in. <br/>
                                        All created projects and tasks are saved to your account.
                                    </Dialog.Description>
                                    <form onSubmit={handleLogin}>
                                        <fieldset className="Fieldset">
                                            <label className="Label" htmlFor="loginUsername">
                                                Username
                                            </label>
                                            <input
                                                className="Input"
                                                id="loginUsername"
                                                type="text"
                                                placeholder="Username"
                                                value={loginUsername}
                                                onChange={(e) => setLoginUsername(e.target.value)}
                                                required
                                            />
                                        </fieldset>
                                        <fieldset className="Fieldset">
                                            <label className="Label" htmlFor="loginPassword">
                                                Password
                                            </label>
                                            <input
                                                className="Input"
                                                id="loginPassword"
                                                type="password"
                                                placeholder="Password"
                                                value={loginPassword}
                                                onChange={(e) => setLoginPassword(e.target.value)}
                                                required
                                            />
                                        </fieldset>
                                        <button type="submit" className="Button green">Log in</button>
                                    </form>
                                    <Dialog.Close asChild>
                                        <button className="IconButton" aria-label="Close" onClick={() => {
                                            setLoginUsername('');
                                            setLoginPassword('');
                                        }}>
                                            <Cross2Icon />
                                        </button>
                                    </Dialog.Close>
                                </Dialog.Content>
                            </Dialog.Portal>
                        </Dialog.Root>
                    </div>
                )}
            </div>
        </header>
    );
};

Header.propTypes = {
  onLoginSuccess: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  loggedIn: PropTypes.bool.isRequired,
  loggedInUsername: PropTypes.string.isRequired,
  setLoggedIn: PropTypes.func.isRequired,
  setLoggedInUsername: PropTypes.func.isRequired,
};

export default Header;
