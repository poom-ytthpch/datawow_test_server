import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Comment, Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import {
  CreateCommentInput,
  CreatePostInput,
  Post,
  UpdatePostInput,
} from 'src/types';
import CacheManger from 'cache-manager';

@Injectable()
export class PostService {
  constructor(
    private readonly repos: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: CacheManger.Cache,
  ) {}

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
    const cacheKey = `posts`;

    let posts = await this.cacheManager.get<Post[]>(cacheKey);

    if (!posts) {
      posts = (await this.repos.post.findMany({
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
      })) as Post[];

      await this.cacheManager.set(cacheKey, posts, 300);
    }

    return posts.map((post) => ({
      ...post,
      comment_count: post._count.comments,
    })) as Post[];
  }

  async post(id: number): Promise<Post> {
    const cacheKey = `posts`;

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

    await this.cacheManager.del(cacheKey);

    return { ...post, comment_count: post._count.comments } as Post;
  }

  async createComment(input: CreateCommentInput): Promise<Comment> {
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

    const cacheKey = `comments:${postId}`;
    await this.cacheManager.del(cacheKey);

    return comment as Comment;
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

  async commentsByPostId(postId: number): Promise<Comment[]> {
    const cacheKey = `comments:${postId}`;

    let comments = await this.cacheManager.get<Comment[]>(cacheKey);

    if (!comments) {
      comments = await this.repos.comment.findMany({
        where: { postId },
        include: { author: true },
        orderBy: { createdAt: 'desc' },
      });

      await this.cacheManager.set(cacheKey, comments, 300);
    }
    return comments;
  }
}
