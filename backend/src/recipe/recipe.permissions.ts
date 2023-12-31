import { Permissions, Actions } from "nest-casl";
import { InferSubjects } from "nest-casl";

import { Roles } from "@prisma/client";
import { Recipe } from "./entities/recipe.entity";
import { Comment } from "./entities/comment.entity";

export type Subjects = InferSubjects<typeof Recipe | typeof Comment>;

export const permissions: Permissions<Roles, Subjects, Actions> = {
    every({can}) {
        can(Actions.read, Recipe);
    },

    CUSTOMER({user, can}) {
        can(Actions.create, Recipe);
        can(Actions.update, Recipe, {authorId: user.id});
        can(Actions.delete, Recipe, {authorId: user.id});

        can(Actions.create, Comment)
        can(Actions.update, Comment, {userId: user.id});
        can(Actions.delete, Comment, {userId: user.id});
    },

    ADMIN({can, cannot, extend}) {
        extend(Roles.CUSTOMER);

        can(Actions.manage, Recipe);
        can(Actions.manage, Comment);
    }
}