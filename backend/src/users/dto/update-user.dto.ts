import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import {ApiProperty} from '@nestjs/swagger'

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiProperty({required: false, nullable: true})
    email?: string;
    @ApiProperty({required: false, nullable: true})
    currentPassword?: string;
    @ApiProperty({required: false, nullable: true})
    password?: string
    @ApiProperty({required: false, nullable: true})
    passwordConfirmation?: string;
    @ApiProperty({required: false, nullable: true})
    picture?: string
}
