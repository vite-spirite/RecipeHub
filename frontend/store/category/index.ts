import { defineStore } from 'pinia'
import {useApi} from '../useApi'
import { CategoryDto } from './category.dto';

export const useCategory = defineStore('category', () => {
    const api = useApi();

    const categories = ref<CategoryDto[]>([]);

    const fetchCategories = async () => {
        if(categories.value.length > 0) return Promise.resolve(categories.value);
        const response = await api.fetch<CategoryDto[]>('/category', 'GET');
        
        categories.value = await response.data.value as CategoryDto[];
        return Promise.resolve(categories.value);
    }

    return {categories, fetchCategories};
});