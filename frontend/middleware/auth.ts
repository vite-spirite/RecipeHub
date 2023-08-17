import { useUser } from "~/store/useUser";
import {storeToRefs} from 'pinia'

export default defineNuxtRouteMiddleware(async (to, from) => {
    const user = useUser();
    const {isAuth, refreshToken} = storeToRefs(user);

    if(refreshToken.value && refreshToken.value != '') {
        await user.refresh(true);
    }

    if(!isAuth.value) {
        return navigateTo('/');
    }
});