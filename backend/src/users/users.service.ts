import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from './entities/user.entity';
import { PublicUserDto } from './dto/public-user.dto';
import { Provider, Roles } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { JwtPayload } from 'src/auth/dto/jwt-payload.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User|undefined> {
    const {passwordConfirmation, ...data} = createUserDto;

    if(data.provider === Provider.LOCAL) {
      if(data.password !== passwordConfirmation) {
        throw new BadRequestException('Password confirmation does not match');
      }

      const {password} = data;
      data.password = await this.hashPassword(password);

      data.providerId = null;
    }
    else {
      data.password = null;
    }
    try {
      const user = await this.prisma.user.create({data});
      return user
    }
    catch(error) {
      if(error.code === 'P2002') {
        throw new BadRequestException('Email already exists');
      }
      throw error;
    }
  }

  async findAll(): Promise<PublicUserDto[]> {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true,
        picture: true,
      }
    });
    return users as PublicUserDto[];
  }

  async findOne(id: number): Promise<PublicUserDto|undefined> {
    return await this.prisma.user.findFirstOrThrow({where: {id}});
  }

  async update(user: JwtPayload, updateUserDto: UpdateUserDto): Promise<User> {
    console.log(updateUserDto);
    const _user = await this.findById(user.id);
    const {passwordConfirmation, currentPassword, ...data} = updateUserDto;

    if(data.email) {
      const user = await this.findByEmail(data.email);
      if(user) {
        throw new BadRequestException('Email already exists');
      }
    }

    if(updateUserDto.password) {
      if(_user.password !== null) {
        if(!currentPassword || !passwordConfirmation) {
          throw new BadRequestException('Current password and password confirmation are required');
        }

        const isPasswordValid = await this.comparePassword(currentPassword, _user.password);

        if(!isPasswordValid) {
          throw new BadRequestException('Current password is invalid');
        }
      }

      if(updateUserDto.password !== updateUserDto.passwordConfirmation) {
        throw new BadRequestException('Password confirmation does not match');
      }

      data.password = await this.hashPassword(updateUserDto.password);
    }

    return await this.prisma.user.update({where: {id: user.id}, data: data});
  }

  async findByEmail(email: string): Promise<User|undefined> {
    return await this.prisma.user.findFirst({where: {email}});
  }

  async findById(id: number): Promise<User|undefined> {
    return this.prisma.user.findFirst({where: {id}});
  }

  async findByProviderId(provider: Provider, providerId: string): Promise<User|undefined> {
    return await this.prisma.user.findFirst({where: {providerId, provider}});
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  async adminjsAuthentificate(email: string, password: string): Promise<any|null> {
    const user = await this.findByEmail(email);

    if(!user || user.roles !== Roles.ADMIN) {
      return null;
    }

    const isPasswordValid = await this.comparePassword(password, user.password);
    if(!isPasswordValid) {
      return null;
    }

    return {email: user.email, title: `${user.firstName} ${user.lastName}`, id: user.id.toString(), avatarUrl: user.picture };
  }
}
