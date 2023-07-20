import {ApiProperty} from '@nestjs/swagger'
import { Prisma } from '@prisma/client'

export class CreateUserDto implements Prisma.userCreateInput {
    @ApiProperty()
    firstName: string
    @ApiProperty()
    lastName: string
    @ApiProperty({uniqueItems: true})
    email: string
    @ApiProperty()
    password: string
    @ApiProperty()
    passwordConfirmation: string;
    @ApiProperty({required: false, nullable: true})
    picture?: Buffer
}
