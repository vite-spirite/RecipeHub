import { Permissions, Actions } from "nest-casl";
import { InferSubjects } from "nest-casl";
import { Roles } from "@prisma/client";
import { Category } from "./entities/catergoy.entity";

export type Subjects = InferSubjects<typeof Category>;

export const permissions: Permissions<Roles, Subjects, Actions> = {
    every({can}) {
        can(Actions.read, Category);
    },

    ADMIN({can, extend}) {
        extend(Roles.CUSTOMER);
        can(Actions.manage, Category);
    }
}