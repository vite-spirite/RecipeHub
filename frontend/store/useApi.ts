import { AsyncData } from "nuxt/app";
import { defineStore } from "pinia";

import { FetchError } from 'ohmyfetch';
import { useUser } from "./useUser";

export const useApi = defineStore('api', () => {
    const runtimeConfig = useRuntimeConfig();
    console.log(runtimeConfig.public.website);
    
    const apiUrl = runtimeConfig.public.apiUrl;

    const fetch = async <T = any>(route: string, method: "GET"|"POST"|"PATCH"|"DELETE", includeBearer: boolean = false, body?: any): Promise<AsyncData<T, FetchError>> => {

        const {setAccessToken, accessToken, refreshToken} = useUser();

        const headers: {[K: string]: string} = {
            'Content-Type': 'application/json',
        };

        if (includeBearer && accessToken) {
            headers['Authorization'] = "Bearer " + accessToken;
        };

        return await useFetch(apiUrl+route, {
            method,
            headers,
            body
        }) as AsyncData<T, FetchError>;
    }

    const fetchAsync = async <T = any>(route: string, method: "GET"|"POST"|"PATCH"|"DELETE", includeBearer: boolean = false, body?: any, headers: {[K: string]: string} = {'Content-Type': 'application/json'}): Promise<T|FetchError> => {
        if(includeBearer) { 
            headers['Authorization'] = "Bearer " + useUser().accessToken;
        }

        try {
            const response = await $fetch<T>(apiUrl+route, {method, headers: headers, body});

            return response;
        }
        catch(e) {
            const error = e as FetchError<T>;

            if(error.status === 401 && includeBearer) {
                await useUser().refresh();
                return await $fetch<T>(apiUrl+route, {method, headers: headers, body});
            }

            throw error;
        }
    }

    return {fetch, fetchAsync}
});