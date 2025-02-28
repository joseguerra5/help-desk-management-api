import { Manager } from "@/domain/management/enterprise/entities/manager";

export class ManagerPresenter {
  static toHTTP(manager: Manager) {
    return {
      id: manager.id.toString(),
      email: manager.email,
      name: manager.name,
      userName: manager.userName,
      employeeId: manager.employeeId.toString(),
      createdAt: manager.createdAt,
      updatedAt: manager.updatedAt,
    }
  }
}