import { prisma } from "@/lib/prisma";
import { PresentationStatus } from "@/generated/prisma/client";

export class PresentationRepository {
  async create(data: { userId: string; fileName: string; slides: object }) {
    return await prisma.presentation.create({
      data: {
        userId: data.userId,
        fileName: data.fileName,
        slides: data.slides,
        status: PresentationStatus.PENDING,
      },
    });
  }

  async findById(id: string, userId: string) {
    return await prisma.presentation.findFirst({
      where: { id, userId },
    });
  }

  async findAllByUser(userId: string) {
    return await prisma.presentation.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async updateStatus(id: string, status: PresentationStatus, summary?: string) {
    return await prisma.presentation.update({
      where: { id },
      data: { status, ...(summary !== undefined && { summary }) },
    });
  }

  async delete(id: string, userId: string) {
    return await prisma.presentation.delete({
      where: { id, userId },
    });
  }
}
