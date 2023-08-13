import { useUser } from "~/store/useUser";

export default defineNuxtRouteMiddleware((to, from) => {
    const { isAuth } = useUser();
    console.log(isAuth);

    if(!isAuth) {
        return navigateTo('/')
    }
})