import { NotificationRepository } from "@/domain/notification/aplication/repositories/notification-repository";
import { Notification } from "@/domain/notification/enterprise/entities/notification";

export class InMemoryNotificationRepository implements NotificationRepository {
  public items: Notification[] = [];
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
    console.log("aqui", notification)
    this.items.push(notification)
  }
}
