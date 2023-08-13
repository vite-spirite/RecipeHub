import { storeToRefs } from "pinia";
import { useUser } from "~/store/useUser";

export default defineNuxtRouteMiddleware(async (to, from) => {
    const user = useUser();
    const {isAuth, refreshToken} = storeToRefs(user);

    console.log(isAuth)

    if(refreshToken.value && refreshToken.value != '') {
        await user.refresh(true);
    }

    if(isAuth.value || refreshToken.value != '') {
        return navigateTo('/');
    }
})