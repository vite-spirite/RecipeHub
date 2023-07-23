import {ApiProperty} from '@nestjs/swagger'
import { Prisma, Provider } from '@prisma/client'

export class CreateUserDto implements Prisma.userCreateInput {
    @ApiProperty()
    firstName: string
    @ApiProperty()
    lastName: string
    @ApiProperty({uniqueItems: true})
    email: string
    @ApiProperty({required: false, nullable: true})
    password?: string
    @ApiProperty({required: false, nullable: true})
    passwordConfirmation?: string;
    @ApiProperty({required: false, nullable: true})
    picture?: string
    
    provider: Provider = Provider.LOCAL
    providerId?: string = null;
}
