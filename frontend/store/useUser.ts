import {useApi} from "@/store/useApi";
import {TokensDto} from "@/api/dto/tokens.dto";
import { UserDto } from "@/api/dto/user.dto";
import { FetchError } from "ohmyfetch";

export const useUser = defineStore('user', () => {
    const refreshTokenName = useRuntimeConfig().public.cookie.refresh;

    const accessToken = ref('');
    const isAuth = ref(false);
    const me: Ref<UserDto|null> = ref(null);

    const refreshToken = useCookie<string>(refreshTokenName, {expires: new Date(new Date().setMonth(new Date().getMonth() + 1)), default: () => ''});

    watch(refreshToken, (value, old) => {
        if(value == old || value == '' || value == undefined) {
            return;
        }

        if(isAuth.value) {
            return;
        }

        if(me.value) {
            return;
        }

        auth();
    });

    const setRefreshToken = (refresh: string) => {
        refreshToken.value = refresh;
    }

    const setAccessToken = (access: string) => {
        accessToken.value = access;
    }

    const refresh = async (refresh: boolean = false) => {
        try {
            const response = await useApi().fetchAsync<string>('/auth/refresh', 'POST', false, {refreshToken: refreshToken.value});

            if(response instanceof FetchError) {
                return false;
            }

            setAccessToken(response);

            if(refresh) {
                await auth();
            }
        }
        catch(e) {
            setRefreshToken('');

            if(isAuth.value) {
                logout();
            }
        }
    }

    const login = async (email: string, password: string) => {
        try {
            const response = await useApi().fetchAsync<TokensDto>('/auth/login', 'POST', false, {email, password});
            
            if(!(response instanceof FetchError)) {
                setRefreshToken(response.refreshToken);
                setAccessToken(response.accessToken);
            }

            return response;
        }
        catch(e) {
            return e as FetchError;
        }
    }

    const register = async (email: string, password: string, passwordConfirmation: string, firstName: string, lastName: string) => {
        try {
            const response = await useApi().fetchAsync<UserDto>('/users', 'POST', false, {email, password, passwordConfirmation, firstName, lastName});
            
            if(!(response instanceof Error)) {

                const _login = await login(email, password);

                if(_login instanceof Error) {
                    throw _login;
                }

                setRefreshToken(_login.refreshToken);
                setAccessToken(_login.accessToken);

                return await auth();
            }

            throw response;
        }
        catch(e) {
            return e as FetchError;
        }
    }
    
    const auth = async () => {
        if(refreshToken.value === undefined || refreshToken.value === '') {
            return false;
        }

        const response = await useApi().fetchAsync<UserDto>('/auth/me', 'GET', true);

        if(response instanceof FetchError) {
            return false;
        }

        me.value = response;
        isAuth.value = true;
    }


    const logout = () => {
        refreshToken.value = '';
        accessToken.value = '';

        isAuth.value = false;
        me.value = null;
    }

    return {
        setRefreshToken, 
        setAccessToken, 
        accessToken, 
        refreshToken, 
        login,
        register,
        logout, 
        isAuth, 
        auth, 
        me, 
        refresh
    }
})