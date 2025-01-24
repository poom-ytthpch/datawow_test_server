import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { SignInInput } from 'src/types';

@Injectable()
export class UserService {
  constructor(private readonly repos: PrismaService) {}

  async signIn(input: SignInInput): Promise<User> {
    const { username } = input;

    const existUser = await this.repos.user.findUnique({
      where: {
        username,
      },
    });

    if (!existUser) {
      const creatUser = await this.repos.user.create({
        data: {
          username,
        },
      });

      return creatUser as User;
    }

    return existUser;
  }
}
