import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PostService } from './post.service';
import { CreateCommentInput, CreatePostInput, UpdatePostInput } from 'src/types';

@Resolver('Post')
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @Mutation()
  async createPost(@Args('input') input: CreatePostInput) {
    return this.postService.createPost(input);
  }

  @Query()
  async posts() {
    return this.postService.posts();
  }

  @Query()
  async post(@Args('id') id: number) {
    return this.postService.post(id);
  }

  @Mutation()
  async createComment(@Args('input') input: CreateCommentInput) {
    return this.postService.createComment(input);
  }

  @Query()
  async authorPosts(@Args('id') id: number) {
    return this.postService.authorPosts(id);
  }

  @Mutation()
  async deletePost(@Args('id') id: number) {
    return this.postService.deletePost(id);
  }

  @Mutation()
  async updatePost(@Args('input') input: UpdatePostInput) {
    return this.postService.updatePost(input);
  }

  @Query()
  async commentsByPostId(@Args('id') id: number) {
    return this.postService.commentsByPostId(id);
  }

}
