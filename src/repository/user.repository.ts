import { prismaClient } from "@config/database";
import { RegisterRequest, UpdateProfileRequest } from "src/schemas/auth.schema";

export default class UserRepository {
  static async findAll() {
    return await prismaClient.user.findMany();
  }

  static async findByEmail(email: string) {
    return await prismaClient.user.findUnique({ where: { email } });
  }

  static async findById(id: number) {
    return await prismaClient.user.findUnique({ where: { id } });
  }

  static async findByExternalId(externalId: string) {
    return await prismaClient.user.findUnique({ where: { externalId } });
  }

  static async createUser(data: RegisterRequest) {
    let avatarUrl = null;

    return await prismaClient.user.create({
      data: {
        name: data.name!,
        email: data.email!,
        password: data.password!,
        phone: data.phone || null,
        avatar: avatarUrl,
      },
    });
  }

  static async updateUser(id: number, data: UpdateProfileRequest) {
    const updateData: any = {
      name: data.name,
      password: data.password,
      phone: data.phone,
      avatar: data.avatar,
    };

    return await prismaClient.user.update({
      where: { id },
      data: updateData,
    });
  }

  static async deleteUser(id: number) {
    return await prismaClient.user.delete({
      where: { id },
    });
  }
}