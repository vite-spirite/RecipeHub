import { Controller, Get, Post, Body, Param, NotFoundException, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiFoundResponse, ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';
import { PublicUserDto } from './dto/public-user.dto';
import { Prisma, Provider } from '@prisma/client';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreatedResponse({type: User})
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.create({...createUserDto, provider: Provider.LOCAL});
  }

  @Get()
  @ApiFoundResponse({type: [PublicUserDto]})
  async findAll(): Promise<PublicUserDto[]> {
    return await this.usersService.findAll();
  }

  @Get(':id')
  @ApiNotFoundResponse({type: null, description: 'not found result'})
  @ApiBadRequestResponse({description: 'invalide parameters'})
  @ApiFoundResponse({type: PublicUserDto})
  async findOne(@Param('id') id: string): Promise<PublicUserDto|null> {
    try {
      const user = await this.usersService.findOne(+id);
      return user;
    }
    catch(e) {
      if(e instanceof Prisma.PrismaClientKnownRequestError) {
        if(e.code === "P2025") {
          throw new NotFoundException(e);
        }
      }

      throw new BadRequestException();
    }
  }

  /*@Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }*/
}
