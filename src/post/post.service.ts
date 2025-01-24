import { Injectable } from '@nestjs/common';
import { Comment } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import {
  CreateCommentInput,
  CreatePostInput,
  Post,
  UpdatePostInput,
} from 'src/types';

@Injectable()
export class PostService {
  constructor(private readonly repos: PrismaService) {}

  async createPost(input: CreatePostInput): Promise<Post> {
    const { title, content, community, authorId } = input;

    const post = await this.repos.post.create({
      data: {
        title,
        content,
        community,
        author: {
          connect: {
            id: authorId,
          },
        },
      },
    });

    return post as Post;
  }

  async posts(): Promise<Post[]> {
    const posts = await this.repos.post.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        community: true,
        author: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return posts.map((post) => ({
      ...post,
      comment_count: post._count.comments,
    })) as Post[];
  }

  async post(id: number): Promise<Post> {
    const post = await this.repos.post.findUnique({
      where: {
        id,
      },

      include: {
        author: true,
        comments: {
          include: {
            author: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        _count: true,
      },
    });

    return { ...post, comment_count: post._count.comments } as Post;
  }

  async createComment(input: CreateCommentInput): Promise<Post> {
    const { content, authorId, postId } = input;

    const comment = await this.repos.comment.create({
      data: {
        content,
        author: {
          connect: {
            id: authorId,
          },
        },
        post: {
          connect: {
            id: postId,
          },
        },
      },
    });

    const post = await this.post(comment.postId);

    return post as Post;
  }

  async authorPosts(id: number): Promise<Post[]> {
    const posts = await this.repos.post.findMany({
      where: {
        authorId: id,
      },
      select: {
        id: true,
        title: true,
        content: true,
        community: true,
        author: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return posts.map((post) => ({
      ...post,
      comment_count: post._count.comments,
    })) as Post[];
  }

  async updatePost(input: UpdatePostInput): Promise<Post> {
    const { postId, title, content, community } = input;

    const update = await this.repos.post.update({
      where: {
        id: postId,
      },
      data: {
        title,
        content,
        community,
      },
    });

    return update as Post;
  }

  async deletePost(id: number): Promise<Post> {
    const deletePst = await this.repos.post.delete({
      where: {
        id,
      },
    });

    return deletePst as Post;
  }
}
