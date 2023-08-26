import { AsyncData } from "nuxt/app";
import { defineStore } from "pinia";

import { FetchError } from 'ohmyfetch';
import { useUser } from "./useUser";

export const useApi = defineStore('api', () => {
    const runtimeConfig = useRuntimeConfig();
    const apiUrlServerSide = runtimeConfig.public.apiUrlServerSide;

    const fetch = async <T = any>(route: string, method: "GET"|"POST"|"PATCH"|"DELETE", includeBearer: boolean = false, body?: any): Promise<AsyncData<T, FetchError>> => {
        const _url = resolveApiUrl(route);

        const {setAccessToken, accessToken, refreshToken} = useUser();

        const headers: {[K: string]: string} = {
            'Content-Type': 'application/json',
        };

        if (includeBearer && accessToken) {
            headers['Authorization'] = "Bearer " + accessToken;
        };

        return await useFetch(_url, {
            method,
            headers,
            body
        }) as AsyncData<T, FetchError>;
    }

    const fetchAsync = async <T = any>(route: string, method: "GET"|"POST"|"PATCH"|"DELETE", includeBearer: boolean = false, body?: any, headers: {[K: string]: string} = {'Content-Type': 'application/json'}): Promise<T|FetchError> => {
        const _url = resolveApiUrl(route);

        if(includeBearer) { 
            headers['Authorization'] = "Bearer " + useUser().accessToken;
        }

        try {            
            const response = await $fetch<T>(_url, {method, headers: headers, body});

            return response;
        }
        catch(e) {
            const error = e as FetchError<T>;

            if(error.status === 401 && includeBearer) {
                await useUser().refresh();
                return await $fetch<T>(_url, {method, headers: headers, body});
            }

            throw error;
        }
    }

    const resolveApiUrl = (route: string) => {
        return process.server ? apiUrlServerSide+route : runtimeConfig.public.apiUrlClientSide+route;
    }

    return {fetch, fetchAsync, resolveApiUrl}
});