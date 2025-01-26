
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum Community {
    History = "History",
    Food = "Food",
    Pets = "Pets",
    Health = "Health",
    Fashion = "Fashion",
    Exercise = "Exercise",
    Others = "Others"
}

export class CreatePostInput {
    authorId?: Nullable<number>;
    title?: Nullable<string>;
    content?: Nullable<string>;
    community?: Nullable<Community>;
}

export class CreateCommentInput {
    content?: Nullable<string>;
    postId?: Nullable<number>;
    authorId?: Nullable<number>;
}

export class UpdatePostInput {
    postId?: Nullable<number>;
    title?: Nullable<string>;
    community?: Nullable<Community>;
    content?: Nullable<string>;
}

export class SignInInput {
    username?: Nullable<string>;
}

export class Post {
    id?: Nullable<number>;
    title?: Nullable<string>;
    content?: Nullable<string>;
    community?: Nullable<Community>;
    author?: Nullable<User>;
    authorId?: Nullable<number>;
    comments?: Nullable<Nullable<Comment>[]>;
    createdAt?: Nullable<Date>;
    updatedAt?: Nullable<Date>;
    _count?: Nullable<CommentCount>;
    comment_count?: Nullable<number>;
}

export class CommentCount {
    comments?: Nullable<number>;
}

export class Comment {
    id?: Nullable<number>;
    content?: Nullable<string>;
    post?: Nullable<Post>;
    postId?: Nullable<number>;
    author?: Nullable<User>;
    authorId?: Nullable<number>;
    createdAt?: Nullable<Date>;
    updatedAt?: Nullable<Date>;
}

export abstract class IQuery {
    abstract posts(): Nullable<Post>[] | Promise<Nullable<Post>[]>;

    abstract post(id?: Nullable<number>): Post | Promise<Post>;

    abstract authorPosts(id: number): Nullable<Post>[] | Promise<Nullable<Post>[]>;

    abstract commentsByPostId(id: number): Nullable<Comment>[] | Promise<Nullable<Comment>[]>;

    abstract user(id?: Nullable<string>): User | Promise<User>;
}

export abstract class IMutation {
    abstract createPost(input: CreatePostInput): Post | Promise<Post>;

    abstract createComment(input: CreateCommentInput): Comment | Promise<Comment>;

    abstract updatePost(input: UpdatePostInput): Post | Promise<Post>;

    abstract deletePost(id: number): Post | Promise<Post>;

    abstract signIn(input: SignInInput): User | Promise<User>;
}

export class User {
    id?: Nullable<number>;
    username?: Nullable<string>;
    image?: Nullable<string>;
    createdAt?: Nullable<Date>;
    updatedAt?: Nullable<Date>;
}

type Nullable<T> = T | null;
