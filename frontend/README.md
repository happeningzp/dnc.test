# Task Management Frontend

This is the React frontend application for the Task Management system, built with Vite.

## Project Setup and Usage

### Prerequisites

- Node.js (version 18.x or higher recommended)
- npm (usually comes with Node.js)

### Installation

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install the project dependencies:
    ```bash
    npm install
    ```

### Environment Variables

This project uses environment variables for configuration, particularly for API endpoints. Vite handles environment variables prefixed with `VITE_`.

1.  Create a `.env.local` file in the `frontend` directory by copying the example file (if one exists, typically `.env.example`).
    ```bash
    cp .env.example .env.local
    ```
    If `.env.example` does not exist, create `.env.local` manually and add the following variables:

    ```env
    # The base URL for the backend API
    VITE_API_BASE_URL=http://localhost:8000/api

    # The URL for fetching the CSRF cookie, typically used with Laravel Sanctum
    VITE_SANCTUM_CSRF_URL=http://localhost:8000/sanctum/csrf-cookie
    ```

2.  Adjust the values in `.env.local` as needed for your local backend setup.

### Running the Development Server

To start the application in development mode (with Hot Module Replacement):

```bash
npm run dev
```

The application will typically be available at `http://localhost:5173` (Vite's default port, but check your terminal output).

### Running Tests

To run the unit and integration tests using Vitest:

```bash
npm run test
```

To run tests with the Vitest UI (provides a graphical interface for tests):

```bash
npm run test:ui
```

### Building for Production

To build the application for production:

```bash
npm run build
```

The build output will be generated in the `frontend/dist` directory. This directory contains the static assets that can be deployed to a web server or hosting platform.

## Project Structure

A brief overview of the key directories within `frontend/src`:

-   `assets/`: Static assets like images, fonts.
-   `components/`: Reusable UI components (e.g., `TaskItem`, `TaskFilter`).
-   `contexts/`: React Context providers (e.g., `AuthContext`).
-   `Enums/`: JavaScript enums (e.g., `TaskStatusEnum`).
-   `hooks/`: Custom React hooks.
-   `pages/`: Top-level components representing application pages (e.g., `LoginPage`, `DashboardPage`).
-   `routes/`: Route configuration and protected route components.
-   `services/`: Modules for API calls and other external services (e.g., `authService`, `taskService`).
-   `utils/`: Utility functions.
-   `setupTests.js`: Setup file for Vitest.
-   `main.jsx`: The main entry point of the application.
-   `App.jsx`: The root component containing main layout and routing.
-   `index.css`: Global styles and Tailwind CSS directives.

## Purpose

This frontend application provides a user interface for managing tasks. Users can register, log in, and then create, view, edit, delete, and manage their tasks, including subtasks. It features filtering and sorting capabilities for the task list.
