<template>
    <div class="w-5/6 sm:w-1/2 card m-auto mt-12 mb-6">
        <div class="card-title">SignUp</div>

        <div class="card-content">

            <form action="#" class="flex flex-col justify-start items-start space-y-5 py-6">

                <div class="alert error" v-if="apiError">
                    <Icon name="ci:error-outline" class="h-5 w-5 mr-2" />
                    <span>{{ apiError }}</span>
                </div>

                <div class="input-inline flex flex-row space-x-2 w-full">
                    <div class="input-control">
                        <label for="firstName">First Name</label>
                        <input v-bind="firstName" class="input" type="text" id="firstName" placeholder="First Name" :error="(typeof errors.firstName === 'string')"/>
                        <span class="error-text-alt">{{ errors.firstName }}</span>
                    </div>

                    <div class="input-control">
                        <label for="lastName">Last Name</label>
                        <input v-bind="lastName" class="input" type="text" id="lastName" placeholder="Last Name" :error="(typeof errors.lastName === 'string')"/>
                        <span class="error-text-alt">{{ errors.lastName }}</span>
                    </div>
                </div>

                <div class="input-control">
                    <label for="email">Email</label>
                    <input v-bind="email" class="input" type="email" id="email" placeholder="Email" :error="(typeof errors.email === 'string')"/>
                    <span class="error-text-alt">{{ errors.email }}</span>
                </div>

                <div class="input-control">
                    <label for="password">Password</label>
                    <input v-bind="password" class="input" type="password" id="password" placeholder="Password" :error="(typeof errors.password === 'string')"/>
                    <span class="error-text-alt">{{ errors.password }}</span>
                </div>

                <div class="input-control">
                    <label for="passwordConfirmation">Password Confirmation</label>
                    <input v-bind="passwordConfirmation" class="input" type="password" id="passwordConfirmation" placeholder="Password Confirmation" :error="(typeof errors.passwordConfirmation === 'string')"/>
                    <span class="error-text-alt">{{ errors.passwordConfirmation }}</span>
                </div>
            </form>

            <div class="card-footer flex flex-row justify-end">
                <button :disabled="!meta.valid || isSubmitting" @click.prevent="register">Signup</button>
            </div>

            <div class="divider">OR</div>

            <div class="providers_buttons flex flex-col justify-center items-center font-primary w-full">
                <button @click="loginWithProvider(Provider.FACEBOOK)" type="button" class="text-white bg-[#3b5998] hover:bg-[#3b5998]/90 focus:ring-4 focus:ring-[#3b5998]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55 mr-2 mb-2">
                    <svg class="mr-2 -ml-1 w-4 h-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="facebook-f" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M279.1 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.4 0 225.4 0c-73.22 0-121.1 44.38-121.1 124.7v70.62H22.89V288h81.39v224h100.2V288z"></path></svg>
                    Sign up with Facebook
                </button>
                <button @click="loginWithProvider(Provider.TWITTER)" type="button" class="text-white bg-[#1da1f2] hover:bg-[#1da1f2]/90 focus:ring-4 focus:ring-[#1da1f2]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#1da1f2]/55 mr-2 mb-2">
                    <svg class="mr-2 -ml-1 w-4 h-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="twitter" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M459.4 151.7c.325 4.548 .325 9.097 .325 13.65 0 138.7-105.6 298.6-298.6 298.6-59.45 0-114.7-17.22-161.1-47.11 8.447 .974 16.57 1.299 25.34 1.299 49.06 0 94.21-16.57 130.3-44.83-46.13-.975-84.79-31.19-98.11-72.77 6.498 .974 12.99 1.624 19.82 1.624 9.421 0 18.84-1.3 27.61-3.573-48.08-9.747-84.14-51.98-84.14-102.1v-1.299c13.97 7.797 30.21 12.67 47.43 13.32-28.26-18.84-46.78-51.01-46.78-87.39 0-19.49 5.197-37.36 14.29-52.95 51.65 63.67 129.3 105.3 216.4 109.8-1.624-7.797-2.599-15.92-2.599-24.04 0-57.83 46.78-104.9 104.9-104.9 30.21 0 57.5 12.67 76.67 33.14 23.72-4.548 46.46-13.32 66.6-25.34-7.798 24.37-24.37 44.83-46.13 57.83 21.12-2.273 41.58-8.122 60.43-16.24-14.29 20.79-32.16 39.31-52.63 54.25z"></path></svg>
                    Sign up with Twitter
                </button>
                <button @click="loginWithProvider(Provider.GITHUB)" type="button" class="text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 mr-2 mb-2">
                    <svg class="mr-2 -ml-1 w-4 h-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="github" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><path fill="currentColor" d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"></path></svg>
                    Sign up with Github
                </button>
                <button @click="loginWithProvider(Provider.GOOGLE)" type="button" class="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 mr-2 mb-2">
                    <svg class="mr-2 -ml-1 w-4 h-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
                    Sign up with Google
                </button>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import { Provider } from '~/api/enums/provider.enum';
import {SignupDto} from '~/types/forms/signup.form.dto';

import {object, string, ref as yupRef} from 'yup';
import { useUser } from '~/store/useUser';

definePageMeta({
    middleware: 'guest'
});

const {register: useRegister} = useUser();
const apiError: Ref<string|undefined> = ref(undefined);

const loginWithProvider = (provider: Provider) => {
    const top = screen.height / 2 - 600 / 2;
    const left = screen.width / 2 - 600 / 2;

    window.open(`${useRuntimeConfig().public.apiUrl}/auth/${provider}`, 'popup', 'width=600,height=600,popup=true,top=' + top + ',left=' + left);
}

const {defineInputBinds, errors, meta, isSubmitting, handleSubmit} = useForm<SignupDto>({
    validationSchema: object({
        email: string().required().email(),
        firstName: string().required(),
        lastName: string().required(),
        password: string().required().min(8).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*\.])(?=.{8,})/, "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"),
        passwordConfirmation: string().required().min(8).equals([yupRef('password')], 'Passwords must match'),
    })
});

const email = defineInputBinds('email');
const firstName = defineInputBinds('firstName');
const lastName = defineInputBinds('lastName');
const password = defineInputBinds('password');
const passwordConfirmation = defineInputBinds('passwordConfirmation');

const register = handleSubmit(async (data) => {
    const response = await useRegister(data.email, data.password, data.passwordConfirmation, data.firstName, data.lastName);

    if(response instanceof Error) {
        apiError.value = response.data ? response.data.message : 'Something went wrong';
    }
    else {
        useRouter().push('/');
    }
});
</script>