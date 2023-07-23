import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/users/entities/user.entity';
import { Permission } from './entities/permission.entity';
import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CaslService {
    constructor(private prisma: PrismaService, @Inject(CACHE_MANAGER) private cache: CacheStore, private config: ConfigService) {}
    
    async getPermissions(user?: User): Promise<Permission[]> {

        const cache = user ? await this.cache.get<Permission[]>(`permissions:${user.id}`) : await this.cache.get<Permission[]>('permissions:anonymous');

        if(cache) {
            return cache;
        }
    
        const userRoles = user ? await this.prisma.user.findUnique({where: {id: user.id}, include: {roles: {include: {permissions: true}}}}) : undefined;
        const roles = user ? userRoles.roles : await this.prisma.role.findMany({include: {permissions: true}, where: {name: 'anonymous'}});
        const permissions = roles.flatMap(role => role.permissions);
        const permissionMapped = permissions.map<Permission>(permission => ({action: permission.action, subject: permission.subject, condition: permission.condition as string, id: permission.id, roleId: permission.roleId}));

        const day = user ? parseInt(this.config.get('REDIS_CACHE_ROLE_TTL')) : parseInt(this.config.get('REDIS_CACHE_ROLE_ANONYMOUS_TTL'));
        const ttl = 60*60*24*day;

        await this.cache.set(`permissions:${user ? user.id : 'anonymous'}`, permissionMapped, ttl);
        return permissionMapped;
    }

    async clearCache(user?: User) {
        await this.cache.del(`permissions:${user ? user.id : 'anonymous'}`);
    }
}
