import { io } from "socket.io-client";

import STORAGE_KEYS from "../constants/storageKeys";

export const initSocket = async () => {

    const token = localStorage.getItem(
        STORAGE_KEYS.AUTH_TOKEN
    );

    return io(
        process.env.REACT_APP_API_URL,

        {
            transports: ["websocket"],
            forceNew: true,
            reconnectionAttempts: Infinity,
            timeout: 10000,
            auth: {
                token,
            },
        }
    );
};