import { Injectable } from '@nestjs/common';
import { AbilityBuilder, ConditionsMatcher, ExtractSubjectType, InferSubjects, MatchConditions, PureAbility, createMongoAbility } from "@casl/ability";
import { Category } from "src/category/entities/catergoy.entity";
import { User } from "src/users/entities/user.entity";
import { PrismaService } from 'src/prisma/prisma.service';
import {CaslAction, CaslSubject, recipe} from '@prisma/client'
import { Recipe } from 'src/recipe/entities/recipe.entity';
import { JwtPayload } from 'src/auth/dto/jwt-payload.dto';

type Subjects = InferSubjects<typeof User|typeof Category|recipe|CaslSubject> | 'all';
export type AppAbility = PureAbility<[CaslAction, Subjects]>;

const lambdaMatcher: ConditionsMatcher<MatchConditions> = matchConditions => matchConditions;

type AbiltityUser = User|JwtPayload & {
    kind: 'user';
    id: User['id']|JwtPayload['id'];
}

@Injectable()
export class CaslAbilityFactory {
    constructor(private prisma: PrismaService) {}

    async defineAbilitiesFor(user?: User|JwtPayload) {
        const {can, build} = new AbilityBuilder<AppAbility>(createMongoAbility);

        const userRoles = user ? await this.prisma.user.findUnique({where: {id: user.id}, include: {roles: {include: {permissions: true}}}}) : undefined;
        const roles = user ? userRoles.roles : await this.prisma.role.findMany({include: {permissions: true}, where: {name: 'anonymous'}});
        const permissions = roles.flatMap(role => role.permissions);

        console.log(permissions);

        permissions.forEach(permission => {
            const {action, subject, condition} = permission;
            //console.log(condition);
            console.log(subject);
            can<recipe>(action, subject, {'authorId': user.id});
        });

        return build({
            conditionsMatcher: lambdaMatcher,
            detectSubjectType: item => item.constructor as ExtractSubjectType<Subjects>
        });
    }
}
