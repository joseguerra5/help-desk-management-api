import { NotificationRepository } from "@/domain/notification/aplication/repositories/notification-repository";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { Notification } from "@/domain/notification/enterprise/entities/notification";
import { PrismaNotificationMapper } from "../mappers/prisma-notification-mapper";

@Injectable()
export class PrismaNotificationRepository implements NotificationRepository {
  constructor(private prisma: PrismaService) { }
  async findManyByRecipientId(recipientId: string): Promise<Notification[]> {
    const notifications = await this.prisma.notification.findMany({
      where: {
        recipientId,
      },

    })

    return notifications.map(PrismaNotificationMapper.toDoomain)
  }
  async create(notification: Notification): Promise<void> {
    const data = PrismaNotificationMapper.toPersistence(notification)

    await this.prisma.notification.create({
      data,
    })
  }
  async findById(id: string): Promise<Notification | null> {
    const notification = await this.prisma.notification.findUnique({
      where: { id: String(id).trim() },
    });

    if (!notification) {
      return null
    }

    return PrismaNotificationMapper.toDoomain(notification)
  }
  async save(notification: Notification): Promise<void> {
    const data = PrismaNotificationMapper.toPersistence(notification)

    await this.prisma.notification.update({
      where: {
        id: data.id,
      },
      data,
    })
  }
}
