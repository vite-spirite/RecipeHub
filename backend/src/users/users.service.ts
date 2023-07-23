import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from './entities/user.entity';
import { PublicUserDto } from './dto/public-user.dto';
import { Provider } from '@prisma/client';
import * as bcrypt from 'bcrypt';

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
    return this.prisma.user.findFirst({where: {id}, include: {roles: true}});
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
}
