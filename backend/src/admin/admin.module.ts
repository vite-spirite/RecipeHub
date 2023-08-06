import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';

import slugify from 'slugify';
import * as bcrypt from 'bcrypt';

@Module({
    imports: [
        Promise.all([
            import('@adminjs/nestjs'),
            import('@adminjs/prisma'),
            import('adminjs')
        ]).then(([{AdminModule}, {Database, Resource, getModelByName}, {default: AdminJs}]) => {
            const prisma = new PrismaService();
      
            AdminJs.registerAdapter({ Database, Resource });
      
            return AdminModule.createAdminAsync({
                imports: [UsersModule],
                inject: [UsersService],
                useFactory: async (userService: UsersService) => ({
                    adminJsOptions: {
                        rootPath: '/admin',
                        resources: [
                            {
                                resource: {model: getModelByName('user'), client: prisma},
                                options: {
                                    navigation: 'Utilisateurs',
                                    listProperties: ['id', 'email', 'roles', 'createdAt', 'updatedAt'],
                                    editProperties: ['email', 'roles', 'firstName', 'lastName', 'password'],
                                    filterProperties: ['email', 'roles', 'firstName', 'lastName'],
                                    actions: {
                                        new: {
                                            before: async ({payload}, {currentAdmin}) => {
                                                console.log(payload);

                                                if (payload.password) {
                                                    payload.password = await bcrypt.hash(payload.password, 10);
                                                }

                                                return {payload, method: 'post'};
                                            }
                                        },
                                        edit: {
                                            before: async ({payload}, {currentAdmin}) => {
                                                if (payload.password) {
                                                    payload.password = await bcrypt.hash(payload.password, 10);
                                                }

                                                return {payload, method: 'put'};
                                            }
                                        }
                                    }
                                }
                            },
                            {
                                resource: {model: getModelByName('category'), client: prisma},
                                options: {
                                    navigation: 'Catégories',
                                    listProperties: ['id', 'name'],
                                    editProperties: ['name', 'picture'],
                                    filterProperties: ['name'],
                                    actions: {
                                        new: {
                                            before: async ({payload}, {currentAdmin}) => {
                                                const lastId = await prisma.category.findFirst({
                                                    select: {id: true},
                                                    orderBy: {id: 'desc'}
                                                });
                                        
                                                let id = lastId?.id ?? 0;
                                                const slug = slugify(`${id + 1} ${payload.name}`, {lower: true});

                                                return {payload: {...payload, slug}, method: 'post'};
                                            }
                                        }
                                    }
                                }
                            },
                            {
                                resource: {model: getModelByName('recipe'), client: prisma},
                                options: {
                                    navigation: 'Recettes',
                                    actions: {
                                        new: {
                                            isAccessible: false,
                                        },
                                        edit: {
                                            isAccessible: false,
                                        }
                                    }
                                    //listProperties: ['id', 'name', 'categories', 'createdAt', 'updatedAt'],
                                }
                            },
                            {
                                resource: {model: getModelByName('ingredient'), client: prisma},
                                options: {
                                    navigation: 'Ingrédients',
                                    createProperties: ['name', 'picture', 'unit'],
                                }
                            },
                            {
                                resource: {model: getModelByName('recipeIngredients'), client: prisma},
                                options: {
                                    navigation: 'Ingrédients des recettes',
                                }
                            },
                            {
                                resource: {model: getModelByName('recipeStep'), client: prisma},
                                options: {
                                    navigation: 'Étapes des recettes',
                                }
                            }
                        ],
                    },
                    auth: {
                        authenticate: async (email, password) => {return Promise.resolve(userService.adminjsAuthentificate(email, password))},
                        cookieName: 'adminjs',
                        cookiePassword: 'secret',
                    },
                    sessionOptions: {
                        resave: true,
                        saveUninitialized: true,
                        secret: 'secret',
                    }
                }),
            })
        }),
    ]
})
export class AdminModule {}
