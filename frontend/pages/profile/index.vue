<template>
    <div class="profile py-5 flex flex-col">
        <h2 class="title w-full px-5 pt-16 pb-5">Informations</h2>

        <div class="divider_h"></div>

        <div class="user-information flex flex-col justify-center items-center sm:flex-row sm:items-center space-y-16 sm:space-y-0 sm:space-x-24 py-5 px-5">
            <img class="sm:h-60 h-20 rounded-full" :src="currentUser?.picture" alt="profile image" />

            <ul class="flex flex-col justify-start items-start space-y-2">
                <li><h1 class="title">Hi, {{ currentUser?.firstName }} {{ currentUser?.lastName }}</h1></li>
                <li>
                    <span class="text-bold">Email:</span> {{ currentUser?.email }}
                </li>
                <li>
                    <span class="text-bold">Frist name:</span> {{ currentUser?.firstName }}
                </li>
                <li>
                    <span class="text-bold">Last name:</span> {{ currentUser?.lastName }}
                </li>
            </ul>
        </div>

        <h2 class="title w-full pt-16 pb-5 px-5">My recipes</h2>
        <div class="divider_h"></div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5 px-5" v-if="meRecipes.length > 0">
            <Recipe class:="w-full" v-if="currentUser" v-for="recipe in meRecipes" :key="recipe.slug" :recipe="{...recipe, author: {id: currentUser.id, firstName: currentUser.firstName, lastName: currentUser.lastName, picture: currentUser.picture}}" />
        </div>
        <div v-else class="flex flex-col justify-center items-center space-y-5 mt-5 px-5">
            <h1 class="title">You don't have any recipes yet</h1>
            <p class="text-center">Create your first recipe now !</p>
        </div>

        <div class="px-5">
            <button class="bg-orange-100 w-full text-center font-bold font-primary text-white py-3 mt-5 hover:bg-orange-300 transition-all duration-200 rounded-md">+ Create new recipe</button>
        </div>

        <h2 class="title w-full pt-16 pb-5 px-5">Settings</h2>
        <div class="divider_h"></div>

        <form action="#" class="px-5 pt-5">
            <div class="input-control">
                <label for="email">Change email</label>
                <input v-bind="email" type="email" id="email" name="email" placeholder="Email" class="input" />
                <span class="error-text-alt">{{ updateErrors.email }}</span>
            </div>
        </form>

        <form action="#" class="px-5 pt-5">
            <div class="input-control">
                <label for="current">Current password</label>
                <input v-bind="currentPassword" type="password" id="current_password" name="current_password" placeholder="Current password" class="input"/>
                <span class="error-text-alt">{{ updateErrors.currentPassword?.replace('currentPassword', 'Current password') }}</span>
            </div>
            <div class="input-control">
                <label for="password">New password</label>
                <input v-bind="password" type="password" id="password" name="password" placeholder="Password" class="input"/>
                <span class="error-text-alt">{{ updateErrors.password?.replace('password', 'New password') }}</span>
            </div>

            <div class="input-control">
                <label for="password">Confirm password</label>
                <input v-bind="confirmPassword" type="password" id="password" name="password" placeholder="Confirm new password" class="input"/>
                <span class="error-text-alt">{{ updateErrors.confirm_password?.replace('confirm_password', 'Confirm password') }}</span>
            </div>
        </form>
    
        <div class="p-5">
            <button @click="updateForm()" :disabled="!meta.valid || isSubmitting" class="bg-green-100 w-full text-center font-bold font-primary text-white py-3 mt-5 hover:bg-green-300 transition-all duration-200 rounded-md">Save</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useUser } from '~/store/useUser';
import * as yup from 'yup';
import { UpdateUserDto } from 'api/dto/updateUser.dto';

definePageMeta({
    middleware: 'auth',
});

const user = useUser();
const {me: currentUser, meRecipes} = storeToRefs(user);
const {update} = user;

if (!currentUser.value) {
    await user.refresh(true);
}

if(meRecipes.value.length === 0) {
    await user.loadMeRecipes();
}

const {defineInputBinds, values: updateValues, errors: updateErrors, setErrors: setUpdateErrors, meta, isSubmitting, handleSubmit} = useForm<{email?: string, currentPassword?: string, password?: string, confirm_password?: string}>({
    validationSchema: yup.object({
        email: yup.string().email().optional(),
        currentPassword: yup.string().when('password', ([value]) => value ? yup.string().required() : yup.string().transform((val, org) => val ? org : null).nullable().optional()),
        password: yup.string().min(8).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*\.])(?=.{8,})/, "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character").optional().transform((val, org) => val ? org : undefined),
        confirm_password: yup.string().when('password', ([value]) => value ? yup.string().min(8).equals([yup.ref('password')], 'Passwords must match') : yup.string().transform((val, org) => val ? org : null).nullable().optional())
    }),
});

const email = defineInputBinds('email');
const currentPassword = defineInputBinds('currentPassword');
const password = defineInputBinds('password');
const confirmPassword = defineInputBinds('confirm_password');

const updateForm = handleSubmit(async (data) => {
    let updateField : Partial<UpdateUserDto> = {};

    if(data.email) {
        updateField = {...updateField, email: data.email};
    }

    if(data.password) {
        if(data.currentPassword && data.confirm_password) {
            updateField = {...updateField, password: data.password, currentPassword: data.currentPassword, passwordConfirmation: data.confirm_password};
        }
        else {
            setUpdateErrors({currentPassword: 'Current password is required', confirm_password: 'Confirm password is required'});
        }
    }
    try {
        await update(updateField);
    }
    catch(e) {
        const error = e as Error;
        switch(error.message) {
            case "Email already exists":
                setUpdateErrors({email: error.message});
                break;
            case "Current password is invalid":
                setUpdateErrors({currentPassword: error.message});
                break;
            case "Password confirmation does not ma":
                setUpdateErrors({confirm_password: error.message});
                break;
        }
    }
});
</script>