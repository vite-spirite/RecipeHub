import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/users/entities/user.entity';
import { Permission } from './entities/permission.entity';

@Injectable()
export class CaslService {
    constructor(private prisma: PrismaService) {}
    
    async getPermissions(user?: User): Promise<Permission[]> {
        const userRoles = user ? await this.prisma.user.findUnique({where: {id: user.id}, include: {roles: {include: {permissions: true}}}}) : undefined;
        const roles = user ? userRoles.roles : await this.prisma.role.findMany({include: {permissions: true}, where: {name: 'anonymous'}});
        const permissions = roles.flatMap(role => role.permissions);
        return permissions.map<Permission>(permission => ({action: permission.action, subject: permission.subject, condition: permission.condition as string, id: permission.id, roleId: permission.roleId}));
    }
}
