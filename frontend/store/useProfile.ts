import { PublicUserDto } from "api/dto/publicUser.dto"
import { useApi } from "./useApi";
import { CompactRecipeDto } from "api/dto/compactRecipe.dto";
import { FetchError } from "ohmyfetch";

type ProfileData = PublicUserDto & {recipes: CompactRecipeDto[]};

export const useProfile = defineStore('profile', () => {
    const profiles: Ref<ProfileData[]> = ref([])

    const fetchProfile = async (id: number): Promise<ProfileData> => {
        const profile = profiles.value.find(p => p.id === id);

        if(profile) {
            return profile;
        }

        const response = await useApi().fetch<PublicUserDto>(`/users/${id}`, 'GET', false);

        if(response.error.value?.status == 404) {
            return Promise.reject(response.error.value);
        }

        profiles.value.push({...response.data.value, recipes: []});
        return {...response.data.value, recipes: []};
    }

    const fetchProfileRecipe = async (id: number): Promise<CompactRecipeDto[]> => {
        const profile = profiles.value.find(p => p.id === id);
        if(profile?.recipes.length && profile.recipes.length > 0) {
            return profile.recipes;
        }

        const recipe = await useApi().fetch<CompactRecipeDto[]>(`/recipe/user/${id}`, 'GET', false);
        const profile_idx = profiles.value.findIndex(p => p.id === id);
        profiles.value[profile_idx].recipes = recipe.data.value;
        return recipe.data.value;
    }

    return {fetchProfile, fetchProfileRecipe};
});