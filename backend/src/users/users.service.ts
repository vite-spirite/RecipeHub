import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from './entities/user.entity';
import { PublicUserDto } from './dto/public-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User|undefined> {
    const {passwordConfirmation, picture, ...data} = createUserDto;
    const user = await this.prisma.user.create({data});
    return user
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

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findByEmail(email: string): Promise<User|undefined> {
    return await this.prisma.user.findFirst({where: {email}});
  }

  async findById(id: number): Promise<User|undefined> {
    return this.prisma.user.findFirst({where: {id}});
  }
}
