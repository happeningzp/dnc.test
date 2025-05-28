import React from 'react';
import { Link } from 'react-router-dom'; // Optional: for navigation links

const HomePage = () => {
    return (
        <div>
            <h1>Welcome</h1>
            <p>This is the home page.</p>
            <nav>
                <ul>
                    <li>
                        <Link to="/login">Login</Link>
                    </li>
                    <li>
                        <Link to="/register">Register</Link>
                    </li>
                    {/* Add other navigation links here as needed */}
                </ul>
            </nav>
        </div>
    );
};

export default HomePage;
