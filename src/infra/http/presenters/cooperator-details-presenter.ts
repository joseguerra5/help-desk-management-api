import { CooperatorDetails } from "@/domain/management/enterprise/entities/value-objects/cooperator-with-details";
import { EquipmentPresenter } from "./inventory-presenter";
import { CallLogPresenter } from "./call-logs-presenter";


export class CooperatorDetailsPresenter {
  static toHTTP(cooperatorDetails: CooperatorDetails) {
    return {
      cooperatorId: cooperatorDetails.cooperatorId.toString(),
      name: cooperatorDetails.name,
      userName: cooperatorDetails.userName,
      employeeId: cooperatorDetails.employeeId,
      nif: cooperatorDetails.nif,
      phone: cooperatorDetails.phone,
      email: cooperatorDetails.email,
      createdAt: cooperatorDetails.createdAt,
      departureDate: cooperatorDetails.departureDate,
      updatedAt: cooperatorDetails.updatedAt,
      inventory: cooperatorDetails.inventory.map(EquipmentPresenter.toHTTPCooperatorEquipment),
      callLogs: cooperatorDetails.callLogs.map(CallLogPresenter.toHTTP)
    }
  }
}
