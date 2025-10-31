import { User } from "@prisma/client";

export type UserResource = Omit<User, 'id' | 'password'>;

export function toUserResource(user: User): UserResource {
  const { id, password, ...rest } = user;
  return {
    ...rest,
  };
}

export function toUsersResource(users: User[]): UserResource[] {
  return users.map(toUserResource);
}