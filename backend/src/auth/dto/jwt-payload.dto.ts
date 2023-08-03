import {User} from '../../users/entities/user.entity';

export type JwtPayload = Omit<User, 'password'|'picture'>;