import { defineStore } from 'pinia'
import {useApi} from '../useApi'
import { CategoryDto } from './category.dto';

export const useCategory = defineStore('category', () => {
    const api = useApi();

    const fetchCategories = async () => {
        const response = await api.fetch<CategoryDto[]>('/category', 'GET');
        
        return response;
    }

    return { fetchCategories};
});