<template>
    <div class="new_recipe p-4 sm:p-12">
        <h1 class="title pb-4">Create a new recipe</h1>
        <div class="divider_h"></div>

        <div class="card mt-4">
            <div class="card-title">
                <h2 class="title">Informations</h2>
            </div>

            <div class="card-content py-10 flex flex-col justify-start items-start space-y-5">
                <div class="input-control">
                    <label for="name">Name</label>
                    <input type="text" id="name" placeholder="Name..." class="input" v-bind="name"/>
                </div>

                <div class="input-control" @click="open()">
                    <label>Pictures</label>

                    <div class="dropzone" ref="dropzone" :class="{'hover': isOverDropZone}">
                        <div class="dropzone-content" v-if="!isOverDropZone && blobFiles.length == 0">
                            <Icon name="heroicons-outline:cloud-upload" class="h-10 w-10" />
                            <span class="text-xl">Drop your files here</span>
                            <span class="text-xl">Click to open galery</span>
                        </div>

                        <div class="dropzone-content" v-else-if="isOverDropZone && blobFiles.length == 0">
                            <Icon name="heroicons-outline:cloud-upload" class="h-10 w-10" />
                            <span class="text-xl">Release your files here</span>
                            <span class="text-xl">Click to open galery</span>
                        </div>

                        <div class="dropzone-files">
                            <div class="dropzone-file relative" v-for="blob in blobFiles" :key="blob.name">
                                <img :src="blob.blob" :alt="blob.name"/>
                                <Icon name="heroicons-outline:x-circle" class="sm:h-10 sm:w-10 w-7 h-7 absolute top-0 right-0 text-red-500 z-20" @click.prevent="blobFiles.splice(blobFiles.indexOf(blob), 1)" />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="input-control">
                    <label for="portion">Portion</label>
                    <input type="number" id="portion" placeholder="Portion..." class="input" min="1" v-bind="portion"/>
                </div>

                <div class="input-control">
                    <label for="difficulty">Difficulty</label>
                    <input type="number" id="difficulty" placeholder="Difficulty..." class="input" min="1" max="6" v-bind="difficulty"/>
                </div>

                <div class="input-control">
                    <label for="time">Times</label>
                    <div class="flex flex-row justify-between items-center space-x-2 w-full">
                        <input type="number" id="preparationTime" placeholder="Preparing time in minutes" class="input" min="0" v-bind="preparationTime"/>
                        <input type="number" id="growingTime" placeholder="growingTime time in minutes" class="input" min="0" v-bind="growingTime"/>
                        <input type="number" id="cookingTime" placeholder="cookingTime time in minutes" class="input" min="0" v-bind="cookingTime"/>
                    </div>
                </div>

                <div class="input-control flex flex-col justify-start items-start">
                    <label for="tags">Categories:</label>
                    <div class="flex flex-row justify-start items-center flex-wrap gap-2">
                        <custom-checkbox v-for="(category, index) in categories" :key="category.slug" :label="category.name" name="categoryIds" :value="+category.id"/>
                    </div>
                </div>
            </div>
        </div>

        <div class="card mt-4">
            <div class="card-title"><h2 class="title">Ingredients</h2></div>

            <div class="card-content py-10 flex flex-col justify-start items-start space-y-5">
                <div class="input-control">
                    <label>Ajouter un ingredients:</label>
                    <auto-complete :items="ingredients ? (ingredients as unknown as any) : []" compareKey="name" indexKey="id" textKey="name" placeholder="Search an ingredient..." no-result-message="Press enter to create new ingredients" :on-select="addIngredient" :on-empty-select="createIngredient"/>
                </div>

                
                <div class="input-control" v-for="(ingredient, idx) in recipeIngredients" :key="ingredient.key">
                    <label v-if="ingredient.value.ingredientId">{{ ingredients?.find(i => i.id === ingredient.value.ingredientId)?.name }}</label>
                    <label v-else>{{ ingredient.value.createIngredient?.name }}</label>
                    <div class="flex flex-row justify-between items-center space-x-2 w-full">
                        <input type="number" placeholder="Quantity" class="input" min="0" v-model="ingredient.value.quantity"/>
                        <input type="text" placeholder="Units" class="input" v-model="ingredient.value.overrideUnit">
                    </div>
                    <button class="bg-red-400 w-full h-full py-3 font-primary font-semibold text-slate-100 rounded-lg" @click="removeRecipeIngredients(idx)">Retirer</button>

                    <div v-if="recipeIngredients.length - 1 !== idx" class="divider_h"></div>
                </div>
            </div>
        </div>

        <div class="card mt-4">
            <div class="card-title"><h2 class="title">Steps</h2></div>

            <div class="card-content py-10 flex flex-col justify-start items-start space-y-5">
                <div class="input-control" v-for="(step, index) in stepRecipeFields" :key="`step-${index}`">
                    <div class='alt-text flex flex-row justify-between items-center w-full'>
                        <label>Step {{ index + 1 }}</label>
                        <button class="bg-none border-0 text-red-500" @click="stepRecipeRemove(index)"><Icon name='heroicons-outline:x-circle'/></button>
                    </div>
                    <textarea class="input" v-model="step.value.description"></textarea>
                    <input type="number" min="1" step="1" class="input" v-model="step.value.time" placeholder="Time in minutes..."/>
                </div>

                <button class="bg-green-400 w-full rounded-lg text-slate-100 font-primary font-semibold py-3 mt-4" @click="addStep">Add step</button>
            </div>
        </div>

        <div class="mt-4 w-full">
            <button class="bg-green-400 w-full rounded-lg text-slate-100 font-primary font-semibold py-3 shadow-lg" :disabled="!meta.valid" @click="submit">Create</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useDropZone } from '@vueuse/core'
import { useCategory } from '~/store/category';
import { CreateRecipeIngredientDto } from '~/api/dto/createRecipeIngredient.dto';
import { IngredientDto } from '~/api/dto/ingredient.dto';
import { useIngredients } from '~/store/useIngredients';
import * as yup from 'yup';
import { useApi } from '~/store/useApi';

definePageMeta({
    middleware: 'auth',
})

type BlobFile = {
    name: string;
    blob: string;
    file: File;
}

const {fetchIngredients} = useIngredients();
const {fetchCategories} = useCategory();

const blobFiles = ref<BlobFile[]>([]);
const dropzone = ref<HTMLDivElement | null>(null);

const onFile = (files: File[]|null) => {
    files?.forEach((file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            blobFiles.value.push({
                name: file.name,
                blob: reader.result as string,
                file,
            });
        };
    });
}

const {isOverDropZone} = useDropZone(dropzone, {onDrop: onFile});
const {onChange, open} = useFileDialog({accept: 'image/*', multiple: true});

onChange((files) => {
    if(!files) return;

    for(let i = 0;i < files.length;i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            blobFiles.value.push({
                name: file.name,
                blob: reader.result as string,
                file,
            });
        };
    }
});

const ingredients = await fetchIngredients();
const categories = await fetchCategories();

//const recipeIngredients = ref<CreateRecipeIngredientDto[]>([]);
//const steps = ref<string[]>(['']);



const {defineInputBinds, meta, isSubmitting, values, handleSubmit, errors} = useForm<{name: string, portion: number, difficulty: number, cookingTime: number, growingTime: number, preparationTime: number, categoryIds: number[]}>({
    validationSchema: {
        name: yup.string().required().min(3),
        portion: yup.number().required().min(1),
        difficulty: yup.number().required().min(1).max(6),
        cookingTime: yup.number().required().min(0),
        growingTime: yup.number().required().min(0),
        preparationTime: yup.number().required().min(0),
        categoryIds: yup.array().of(yup.number().required()).required().min(1),
        //pictures: yup.array().of(yup.string().required()).required().min(1),
        ingredients: yup.array().of(yup.object().shape({
            ingredientId: yup.number().nullable(),
            createIngredient: yup.object().shape({
                name: yup.string().required().min(3),
                unit: yup.string().required().min(1),
                picture: yup.string().nullable(),
            }).nullable(),
            overrideUnit: yup.string().nullable(),
            quantity: yup.number().required().min(0),
        })).required().min(1),
        steps: yup.array().of(yup.object().shape({
            description: yup.string().required().min(3).required(),
            time: yup.number().required().min(0),
        }).required()).required().min(1),
    }
});

const name = defineInputBinds('name');
const portion = defineInputBinds('portion');
const difficulty = defineInputBinds('difficulty');
const cookingTime = defineInputBinds('cookingTime');
const growingTime = defineInputBinds('growingTime');
const preparationTime = defineInputBinds('preparationTime');

const {fields: recipeIngredients, push: pushRecipeIngredients, remove: removeRecipeIngredients} = useFieldArray<CreateRecipeIngredientDto>('ingredients');
const {fields: stepRecipeFields, push: stepRecipePush, remove: stepRecipeRemove} = useFieldArray<{description: string, time: number}>('steps');

const addIngredient = (ingredient: IngredientDto) => {
    pushRecipeIngredients({
        ingredientId: ingredient.id,
        createIngredient: null,
        overrideUnit: ingredient.unit,
        quantity: 0,
    });
}

const createIngredient = (name: string) => {
    pushRecipeIngredients({
        ingredientId: null,
        createIngredient: {
            name,
            unit: ' ',
            picture: undefined,
        },
        overrideUnit: '',
        quantity: 0,
    });
}

const addStep = () => {
    stepRecipePush({
        description: '',
        time: 0,
    });
}

const submit = handleSubmit(async () => {
    const {fetchAsync} = useApi();

    const formData = new FormData();
    blobFiles.value.forEach((blob) => {formData.append('files', blob.file)});
    const files = await fetchAsync<{filename: string, path: string}[]>('/recipe/create/upload', 'POST', true, formData, {});

    if(files instanceof Error) {
        console.error(files);
        return;
    }

    const times = {
        preparationTime: preparationTime.value.value ? preparationTime.value.value * 60 : 0,
        growingTime: growingTime.value.value ? growingTime.value.value * 60 : 0,
        cookingTime: cookingTime.value.value ? cookingTime.value.value * 60 : 0,
    }

    const result = await fetchAsync('/recipe', 'POST', true, {...values, ...times, pictures: files.map((file) => file.path), ingredients: recipeIngredients.value.map(i => (i.value.ingredientId === null ? {...i.value, createIngredient: {...i.value.createIngredient, unit: i.value.overrideUnit}}: i.value)), steps: stepRecipeFields.value.map((s, i) => ({...s.value, step: i + 1}))});
    navigateTo('/recipe/' + result.slug);
});

</script>