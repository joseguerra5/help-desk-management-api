import { NotificationRepository } from "@/domain/notification/aplication/repositories/notification-repository";
import { Notification } from "@/domain/notification/enterprise/entities/notification";

export class InMemoryNotificationRepository implements NotificationRepository {
  public items: Notification[] = [];
  async findManyByRecipientId(recipientId: string): Promise<Notification[]> {
    const notifications = this.items.filter((item) => item.recipientId.toString() === recipientId)

    return notifications
  }
  async findById(id: string) {
    const notification = this.items.find((item) => item.id.toString() === id)

    if (!notification) {
      return null
    }

    return notification
  }
  async save(notification: Notification): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === notification.id)

    this.items[itemIndex] = notification
  }
  async create(notification: Notification) {
    this.items.push(notification)
  }
}
