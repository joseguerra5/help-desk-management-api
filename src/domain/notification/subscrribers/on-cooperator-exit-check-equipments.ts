import { EventHandler } from "@/core/events/event-handler";
import { SendNotificationUseCase } from "../aplication/use-cases/send-notification";
import { DomainEvents } from "@/core/events/domain-events";
import { CooperatorExitedEvent } from "@/domain/management/enterprise/events/cooperator-exited-event";
import { CooperatorRepository } from "@/domain/management/application/repositories/cooperator-repository";
import { ManagerRepository } from "@/domain/management/application/repositories/manager-repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class OnCooperatorExitCheckEquipment implements EventHandler {
  constructor(
    private sendNotification: SendNotificationUseCase,
    private cooperatorRepository: CooperatorRepository,
    private managerRepository: ManagerRepository,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendEquipmentOnCooperatorNotification.bind(this),
      CooperatorExitedEvent.name,
    )
  }

  private async sendEquipmentOnCooperatorNotification({ cooperator }: CooperatorExitedEvent) {

    const cooperatorOnDataBase = await this.cooperatorRepository.findById(cooperator.id.toString())

    if (!cooperatorOnDataBase) {
      return
    }

    if (cooperatorOnDataBase.inventory?.currentItems?.length > 0) {
      const managers = await this.managerRepository.findMany()

      await Promise.all(
        managers.map(manager => {
          this.sendNotification.execute({
            recipientId: manager.id.toString(),
            title: `Colaborador ${cooperator.userName} com equipamentos pendentes`,
            content: `O colaborador ${cooperator.userName} ainda possui ${cooperator.inventory.currentItems.length} equipamento(s) emprestado(s).`,
          })
        }
        )
      );

    }
  }
}

