import { defineStore } from 'pinia'
import {useApi} from '../useApi'
import { CategoryDto } from '~/api/dto/category.dto';
import { RecipePaginateDto } from 'api/dto/recipePaginate.dto';

type Category = CategoryDto & {
    recipes: RecipePaginateDto
}

export const useCategory = defineStore('category', () => {
    const api = useApi();

    const categories = ref<Category[]>([]);

    const fetchCategories = async () => {
        if(categories.value.length > 0) return Promise.resolve(categories.value);
        const response = await api.fetchAsync<CategoryDto[]>('/category', 'GET');

        if(response instanceof Error) return Promise.reject(response);

        categories.value = response.map(category => ({...category, recipes: {data: [], page: 0, perPage: 0, total: 0, lastPage: 0}}));

        return Promise.resolve(categories.value);
    }

    const fetchRecipes = async (category: Category, page: number = 1) => {

        if(category.recipes.lastPage !== 0 && page > category.recipes.lastPage) {
            return Promise.resolve(category);
        }


        const response = await api.fetchAsync<RecipePaginateDto>(`/recipe/category/${category.id}/${page}`, 'GET');

        const _c = categories.value.find(c => c.id === category.id);

        if(!_c) return;

        if(response instanceof Error) return Promise.reject(response);

        _c.recipes.data.push(...response.data);
        _c.recipes.perPage = response.perPage;
        _c.recipes.total = response.total;
        _c.recipes.lastPage = response.lastPage;
        _c.recipes.page = page;


        return Promise.resolve(_c);
    }

    return {categories, fetchCategories, fetchRecipes};
});