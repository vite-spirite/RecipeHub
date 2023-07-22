import {ApiProperty} from "@nestjs/swagger";

export class RefreshBodyAuthDto {
    @ApiProperty()
    refreshToken: string;
}