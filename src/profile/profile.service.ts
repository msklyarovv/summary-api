import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Profile } from '@prisma/client';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Возвращает единственный профиль.
   * Связанные данные (skills, experience, projects, links) загружаются лениво
   * через field-резолверы с DataLoader — здесь только сам профиль.
   */
  async findFirst(): Promise<Profile> {
    const profile = await this.prisma.profile.findFirst();
    if (!profile) {
      throw new NotFoundException('Профиль не найден. Запустите seed.');
    }
    return profile;
  }
}
