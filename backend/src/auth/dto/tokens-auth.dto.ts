import { ApiProperty } from "@nestjs/swagger";

export class TokensAuthDto {
    @ApiProperty()
    accessToken: string;
    @ApiProperty()
    refreshToken: string;
}