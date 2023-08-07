import { defineStore } from "pinia";

export const useApi = defineStore('api', () => {
    const runtimeConfig = useRuntimeConfig();
    
    const apiUrl = runtimeConfig.public.apiUrl;

    const refreshToken = useCookie(runtimeConfig.public.cookie.refresh);
    const accessToken = useCookie(runtimeConfig.public.cookie.access);

    const fetch = <T = any>(route: string, method: "GET"|"POST"|"PATCH"|"DELETE", includeBearer: boolean = false, body?: any) => {
        const headers: {[K: string]: string} = {
            'Content-Type': 'application/json',
        };

        if (includeBearer && accessToken) {
            headers['Authorization'] = "Bearer " + accessToken.value;
        };

        return useFetch(apiUrl + route, {
            method: method,
            headers,
            body: JSON.stringify(body)
        });
    }

    return {fetch}
});