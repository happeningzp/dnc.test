import { v4 as uuidv4 } from 'uuid';
import Cookies from 'js-cookie';

const COOKIE_NAME = 'user_tasks_identifier'; // Must match the name used in the backend

/**
 * Retrieves the existing user identifier from cookies or generates and stores a new one.
 * @returns {string} The user's unique identifier.
 */
export const getUserIdentifier = () => {
    let userId = Cookies.get(COOKIE_NAME);

    if (!userId) {
        userId = uuidv4();
        // Store the new ID in a cookie that expires in 365 days.
        // Adjust cookie options as needed (e.g., domain, path, secure, sameSite).
        Cookies.set(COOKIE_NAME, userId, { expires: 365, path: '/' }); 
        console.log('New user identifier generated and stored:', userId);
    }
    return userId;
};
