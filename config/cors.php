<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => ['http://localhost:5173', 'http://127.0.0.1:5173'], // Specific frontend origins

    'allowed_origins_patterns' => [],

    'allowed_headers' => [
        'Content-Type',
        'X-Requested-With',
        'Accept',
        'X-XSRF-TOKEN', // Important for Laravel Sanctum CSRF protection
        // 'Authorization', // Removed as we are moving towards cookie-based auth
    ],

    'exposed_headers' => [],

    'max_age' => 0, // Or a suitable value like 3600

    'supports_credentials' => true, // Essential for cookie-based sessions (Sanctum)

];
