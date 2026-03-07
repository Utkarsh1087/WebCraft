import { auth } from './lib/auth.js';
import { toNodeHandler } from 'better-auth/node';

console.log("Auth initialized...");
const handler = toNodeHandler(auth);
console.log("Handler created...");

setTimeout(() => {
    console.log("Still alive...");
}, 5000);
