import { parseArgs } from 'util';
import {PrismaClient, Roles} from '@prisma/client'
import {faker} from '@faker-js/faker/locale/fr';

const prisma = new PrismaClient();

const createPermission = async () => {
    const firstUser = await prisma.user.findFirst({orderBy: {id: "asc"}});
    await prisma.user.update({
        where: {
            id: firstUser.id
        },
        data: {
            roles: Roles.ADMIN
        }
    });
}

const recipe = async () => {

    await prisma.ingredient.createMany({
        data: [
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
    });

    const ingredients = await prisma.ingredient.findMany({take: 4});

    const recipe = await prisma.recipe.create({
        data: {
            name: faker.lorem.words(),
            slug: faker.lorem.slug(),
            pictures: [faker.image.urlLoremFlickr({category: 'food', width: 640, height: 480}), faker.image.urlLoremFlickr({category: 'food', width: 640, height: 480})],
            preparationTime: faker.number.int({min: 1, max: 60}),
            cookingTime: faker.number.int({min: 1, max: 60}),
            growingTime: faker.number.int({min: 1, max: 60}),
            difficulty: faker.number.int({min: 1, max: 6}),
            portions: faker.number.int({min: 1, max: 6}),
            authorId: 1,
            ingredients: {
                createMany: {
                    data: [
                        {
                            ingredientId: ingredients[0].id,
                            quantity: faker.number.int({min: 1, max: 60}),
                        },
                        {
                            ingredientId: ingredients[1].id,
                            quantity: faker.number.int({min: 1, max: 60}),
                        },
                        {
                            ingredientId: ingredients[2].id,
                            quantity: faker.number.int({min: 1, max: 60}),
                        },
                        {
                            ingredientId: ingredients[3].id,
                            quantity: faker.number.int({min: 1, max: 60}),
                        },
                    ]
                }
            },
            steps: {
                createMany: {
                    data: [
                        {
                            step: 0,
                            description: faker.lorem.paragraphs(),
                            time: faker.number.int({min: 1, max: 60}),
                        },
                        {
                            step: 1,
                            description: faker.lorem.paragraphs(),
                            time: faker.number.int({min: 1, max: 60}),
                        },
                        {
                            step: 2,
                            description: faker.lorem.paragraphs(),
                            time: faker.number.int({min: 1, max: 60}),
                        },
                        {
                            step: 3,
                            description: faker.lorem.paragraphs(),
                            time: faker.number.int({min: 1, max: 60}),
                        },
                        {
                            step: 4,
                            description: faker.lorem.paragraphs(),
                            time: faker.number.int({min: 1, max: 60}),
                        },
                    ]
                }
            }
        }
    });
}

const main = async () => {
    const {
        values: {environment},
    } = parseArgs({options: {environment: {type: "string", alias: "e"}}});

    switch (environment) {
        case "permissions": {
            await createPermission();
            break;
        }
        case 'recipe': {
            await recipe();
            break;
        }
        default:
            console.log('enviroment not found | use permissions or recipe');
            break;
    }    
}

main().then(async () => {
    await prisma.$disconnect()
    console.log("sedd done")
}).catch(async (e) => {
    await prisma.$disconnect()
    console.log(e)
});