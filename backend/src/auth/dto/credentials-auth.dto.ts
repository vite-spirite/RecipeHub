import { ApiProperty } from "@nestjs/swagger";

export class CredentialsAuthDto {
    @ApiProperty()
    email: string;
    @ApiProperty()
    password: string;
}