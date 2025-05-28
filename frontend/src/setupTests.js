import '@testing-library/jest-dom';

// You can add other global setup here if needed, for example:
// - Mocking global objects (localStorage, fetch)
// - Setting up MSW (Mock Service Worker) for API mocking across tests

// Example: Mocking localStorage
// const localStorageMock = (function() {
//   let store = {};
//   return {
//     getItem: function(key) {
//       return store[key] || null;
//     },
//     setItem: function(key, value) {
//       store[key] = value.toString();
//     },
//     removeItem: function(key) {
//       delete store[key];
//     },
//     clear: function() {
//       store = {};
//     }
//   };
// })();
// Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// If you need to mock IntersectionObserver for certain components:
// global.IntersectionObserver = class IntersectionObserver {
//   constructor() {}
//   observe() { return null; }
//   unobserve() { return null; }
//   disconnect() { return null; }
// };

console.log('Test setup file loaded.');
