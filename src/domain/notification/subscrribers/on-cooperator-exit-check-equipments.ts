import { EventHandler } from "@/core/events/event-handler";
import { SendNotificationUseCase } from "../aplication/use-cases/send-notification";
import { DomainEvents } from "@/core/events/domain-events";
import { CooperatorExitedEvent } from "@/domain/management/enterprise/events/cooperator-exited-event";
import { CooperatorRepository } from "@/domain/management/application/repositories/cooperator-repository";
import { ManagerRepository } from "@/domain/management/application/repositories/manager-repository";
import { Schedule } from "../aplication/schedule/schedule-registry";
import { Job } from "../aplication/schedule/job";
import { Injectable } from "@nestjs/common";

@Injectable()
export class OnCooperatorExitCheckEquipment implements EventHandler {
  constructor(
    private sendNotification: SendNotificationUseCase,
    private cooperatorRepository: CooperatorRepository,
    private managerRepository: ManagerRepository,
    private schedule: Schedule,
    private job: Job
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.scheduleEquipmentCheck.bind(this),
      CooperatorExitedEvent.name,
    )
  }

  private async scheduleEquipmentCheck({ cooperator }: CooperatorExitedEvent) {
    const checkDates = [
      new Date(),
      cooperator.departureDate,
      this.addDays(cooperator.departureDate, 7),
      this.addDays(cooperator.departureDate, 15),
    ]


    checkDates.forEach((date, index) => {
      const jobName = `check-equipment-${cooperator.id.toString()}-${index}`
      this.schedule.scheduleOnce(jobName, date, async () => {
        await this.verifyEquipment(cooperator.id.toString())
      })
    });

    const recurringJobName = `recurring-check-equipment-${cooperator.id.toString()}`
    this.schedule.scheduleRecurring(recurringJobName, "0 0 0 */30 * *", // Agendamento a cada 30 dias
      async () => {
        await this.verifyEquipment(cooperator.id.toString())
      })
  }

  private async verifyEquipment(cooperatorId: string) {
    console.log(`Cooperator ${cooperatorId} still has ${cooperatorId} equipment(s) borrowed.`)
    const cooperator = await this.cooperatorRepository.findById(cooperatorId)
    if (!cooperator) {
      return
    }


    if (cooperator.inventory.currentItems.length > 0) {
      const managers = await this.managerRepository.findMany()

      console.log(`Cooperator ${cooperator.userName} still has ${cooperator.inventory.currentItems.length} equipment(s) borrowed.`)
      await Promise.all(
        managers.map(manager =>
          this.sendNotification.execute({
            recipientId: manager.id.toString(),
            title: `Colaborador com equipamentos pendentes`,
            content: `O colaborador ${cooperator.userName} ainda possui ${cooperator.inventory.currentItems.length} equipamento(s) emprestado(s).`,
          }),
        ),
      );
    } else {
      // Remover o job recorrente se todos os equipamentos forem devolvidos
      const jobName = `recurring-check-${cooperatorId}`;
      this.job.deleteJob(jobName);
    }
  }


  private addDays(date: Date, days: number): Date {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
  }
}

