import Pusher from 'pusher';
import PusherClient from 'pusher-js';

// Check if we are in a browser environment
const isBrowser = typeof window !== "undefined";

// Server-side Pusher instance (will use env variables)
export const pusher = !isBrowser 
  ? new Pusher({
      appId: process.env.PUSHER_APP_ID || "",
      key: process.env.PUSHER_APP_KEY || "",
      secret: process.env.PUSHER_APP_SECRET || "",
      cluster: process.env.PUSHER_APP_CLUSTER || "ap1",
      useTLS: true,
    })
  : null;

// Client-side Pusher instance
export const pusherClient = isBrowser
  ? new PusherClient(
      process.env.NEXT_PUBLIC_PUSHER_APP_KEY || "",
      {
        cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER || "ap1",
      }
    )
  : null; 