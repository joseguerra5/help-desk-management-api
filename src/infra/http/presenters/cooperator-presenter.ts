import { Cooperator } from "@/domain/management/enterprise/entities/cooperator";

export class CooperatorPresenter {
  static toHTTP(cooperator: Cooperator) {
    return {
      name: cooperator.name,
      userName: cooperator.userName,
      employeeId: cooperator.employeeId,
      nif: cooperator.nif,
      phone: cooperator.phone,
      email: cooperator.email,
      inventory: cooperator.inventory.currentItems,
      createdAt: cooperator.createdAt,
      departureDate: cooperator.departureDate,
      updatedAt: cooperator.updatedAt,
    }
  }
}