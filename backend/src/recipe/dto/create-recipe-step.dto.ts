import { ApiProperty } from '@nestjs/swagger';

export class CreateRecipeStepDto {
    @ApiProperty()
    step: number;
    @ApiProperty()
    time: number;
    @ApiProperty()
    description: string;
}