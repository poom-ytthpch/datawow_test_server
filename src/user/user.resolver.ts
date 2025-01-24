import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { SignInInput } from 'src/types';

@Resolver('User')
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation()
  async signIn(@Args('input') input: SignInInput) {
    return this.userService.signIn(input);
  }
}
