import {faker} from '@faker-js/faker/locale/fr';
import type { CreateRecipeDto } from '../src/recipe/dto/create-recipe.dto';

export const main = async () => {

    const ingredients = [
        {
            name: "sel",
            unit: "g",
        },
        {
            name: "poivre",
            unit: "g",
        },
        {
            name: "pomme de terre",
            unit: "",
        },
        {
            name: "carotte",
            unit: "",
        },
    ]

    const recipe: CreateRecipeDto = {
        name: faker.lorem.words(),
        pictures: [faker.image.urlLoremFlickr({category: 'food', width: 640, height: 480}), faker.image.urlLoremFlickr({category: 'food', width: 640, height: 480})],
        preparationTime: convertHourToSecond(faker.datatype.number({min: 0.5, max: 5})),
        cookingTime: convertHourToSecond(faker.datatype.number({min: 0.5, max: 5})),
        growingTime: convertHourToSecond(faker.datatype.number({min: 0.5, max: 5})),
        difficulty: faker.datatype.number({min: 1, max: 6}),
        portions: faker.datatype.number({min: 1, max: 6}),
        categoryIds: [1],
        ingredients: [
            {
                createIngredient: {
                    name: ingredients[0].name,
                    unit: ingredients[0].unit,
                    picture: null,
                },
                quantity: faker.datatype.number({min: 1, max: 60}),
                ingredientId: null,
                overrideUnit: null,
            },
            {
                createIngredient: {
                    name: ingredients[1].name,
                    unit: ingredients[1].unit,
                    picture: null,
                },
                quantity: faker.datatype.number({min: 1, max: 60}),
                ingredientId: null,
                overrideUnit: null,
            },
            {
                createIngredient: {
                    name: ingredients[2].name,
                    unit: ingredients[2].unit,
                    picture: null,
                },
                quantity: faker.datatype.number({min: 1, max: 60}),
                ingredientId: null,
                overrideUnit: null,
            },
            {
                ingredientId: null,
                createIngredient: {
                    name: ingredients[3].name,
                    unit: ingredients[3].unit,
                    picture: null,
                },
                quantity: faker.datatype.number({min: 1, max: 60}),
                overrideUnit: null,
            },
        ],
        steps: [
            {
                description: faker.lorem.paragraph(),
                step: 0,
                time: convertHourToSecond(faker.datatype.number({min: 0.5, max: 5})),
            },
            {
                description: faker.lorem.paragraph(),
                step: 1,
                time: convertHourToSecond(faker.datatype.number({min: 0.5, max: 5})),
            },
            {
                description: faker.lorem.paragraph(),
                step: 2,
                time: convertHourToSecond(faker.datatype.number({min: 0.5, max: 5})),
            },
            {
                description: faker.lorem.paragraph(),
                step: 3,
                time: convertHourToSecond(faker.datatype.number({min: 0.5, max: 5})),
            },
        ],
    };

    console.log(JSON.stringify(recipe));
}

const convertHourToSecond = (hour: number) => {
    return hour * 60 * 60;
}

main();