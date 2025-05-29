import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    // Define button classes consistent with the rest of the app
    const baseButtonClasses = "inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-150";
    const primaryButtonClasses = `${baseButtonClasses} text-white bg-green-600 hover:bg-green-700 focus:ring-green-500`;

    return (
        <div className="py-12 bg-white rounded-lg shadow-lg"> {/* Added shadow and rounded corners */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="text-4xl font-extrabold text-gray-800 sm:text-5xl md:text-6xl">
                    Welcome to Your Task Manager
                </h1>
                <p className="mt-6 text-xl text-gray-600">
                    Organize your work and life, finally. This simple and intuitive task management tool
                    helps you keep track of everything you need to do.
                </p>
                <div className="mt-10">
                    <Link
                        to="/dashboard"
                        className={primaryButtonClasses} // Use consistent button styling
                    >
                        Go to My Task Dashboard
                    </Link>
                </div>
                <div className="mt-12">
                    <h2 className="text-2xl font-semibold text-gray-700">Features:</h2>
                    <ul className="mt-4 text-left inline-block list-disc list-inside text-gray-600 space-y-2">
                        <li>Create, edit, and delete tasks</li>
                        <li>Organize tasks with subtasks</li>
                        <li>Set priorities and mark tasks as done</li>
                        <li>Filter and sort your task list</li>
                        <li>Minimalist and responsive design</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
