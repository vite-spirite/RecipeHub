import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Permission } from './entities/permission.entity';
import { CaslService } from './casl.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {ApiBearerAuth, ApiTags} from '@nestjs/swagger';

@ApiTags('permissions')
@Controller('casl')
export class CaslController {
    constructor(private readonly caslService: CaslService) {}

    @Get()
    async getPermissions(@Req() req: any): Promise<Permission[]> {
        return await this.caslService.getPermissions(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get('logged')
    async getPermissionsLogged(@Req() req: any): Promise<Permission[]> {
        return await this.caslService.getPermissions(req.user);
    }
}
