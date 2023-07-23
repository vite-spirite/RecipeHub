import { Injectable } from '@nestjs/common';
import { AbilityBuilder, ConditionsMatcher, ExtractSubjectType, InferSubjects, MatchConditions, PureAbility } from "@casl/ability";
import { Category } from "src/category/entities/catergoy.entity";
import { User } from "src/users/entities/user.entity";
import { PrismaService } from 'src/prisma/prisma.service';
import {CaslAction, CaslSubject} from '@prisma/client'

type Subjects = InferSubjects<typeof User|typeof Category|CaslSubject> | 'all';
export type AppAbility = PureAbility<[CaslAction, Subjects]>;

const lambdaMatcher: ConditionsMatcher<MatchConditions> = matchConditions => matchConditions;

@Injectable()
export class CaslAbilityFactory {
    constructor(private prisma: PrismaService) {}

    async defineAbilitiesFor(user?: User) {
        const {can, build} = new AbilityBuilder<AppAbility>(PureAbility);

        const userRoles = user ? await this.prisma.user.findUnique({where: {id: user.id}, include: {roles: {include: {permissions: true}}}}) : undefined;
        const roles = user ? userRoles.roles : await this.prisma.role.findMany({include: {permissions: true}, where: {name: 'anonymous'}});
        const permissions = roles.flatMap(role => role.permissions);

        permissions.forEach(permission => {
            const {action, subject, condition} = permission;
            can(action, subject, condition);
        });

        return build({
            conditionsMatcher: lambdaMatcher,
            detectSubjectType: item => item.constructor as ExtractSubjectType<Subjects>
        });
    }
}
