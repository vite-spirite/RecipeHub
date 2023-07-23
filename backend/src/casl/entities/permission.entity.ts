import { CaslAction, CaslSubject, Prisma, permission } from "@prisma/client";
import {ApiProperty} from '@nestjs/swagger';

export class Permission implements permission {
    @ApiProperty()
    id: number;
    @ApiProperty({enum: CaslSubject})
    subject: CaslSubject;
    @ApiProperty({enum: CaslAction})
    action: CaslAction;
    @ApiProperty({nullable: true})
    condition: string|null;
    @ApiProperty()
    roleId: number;
    
}