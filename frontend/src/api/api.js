import axios from "axios";
import STORAGE_KEYS from "../constants/storageKeys";
const api = axios.create({

    baseURL: process.env.REACT_APP_API_URL,

    headers: {

        "Content-Type": "application/json",

    },

});

api.interceptors.request.use(

    (config) => {

        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        if (token) {

            config.headers.Authorization = `Bearer ${token}`;

        }
        return config;
    },
    (error) => Promise.reject(error)

);

export const updateRoomName = async (
    roomId,
    roomName
) => {

    const response = await api.patch(
        `/api/rooms/${roomId}`,
        {
            roomName,
        }
    );

    return response.data;

};

export default api;