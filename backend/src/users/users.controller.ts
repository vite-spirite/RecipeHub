import { Controller, Get, Post, Body, Param, NotFoundException, BadRequestException, Patch, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import {User as UserDecorator} from '../auth/decorators/user.decorators'
import { ApiBadRequestResponse, ApiCreatedResponse, ApiFoundResponse, ApiNotFoundResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PublicUserDto } from './dto/public-user.dto';
import { Prisma, Provider } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtPayload } from 'src/auth/dto/jwt-payload.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

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

  @UseGuards(JwtAuthGuard)
  @Patch()
  @ApiBearerAuth()
  @ApiBadRequestResponse({description: 'invalide parameters, password confirmation does not match or email already exists'})
  async update(@UserDecorator() user: JwtPayload, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(user, updateUserDto);
  }

  
  /*@Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }*/
}
