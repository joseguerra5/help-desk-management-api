import { Notification } from "../../enterprise/entities/notification";

export interface Count {
  recipientId: string;
  status: "read" | "unread";
}

export abstract class NotificationRepository {
  abstract create(notification: Notification): Promise<void>
  abstract findById(id: string): Promise<Notification | null>
  abstract save(notification: Notification): Promise<void>
  abstract findManyByRecipientId(recipientId: string): Promise<Notification[]>
  abstract count(params: Count): Promise<number>;


}