import { SendNotificationUseCase } from "@/domain/notification/aplication/use-cases/send-notification";
import { OnCooperatorExitCheckEquipment } from "@/domain/notification/subscrribers/on-cooperator-exit-check-equipments";
import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { ScheduleModule } from "../schedule/schedule.module";

@Module({
  imports: [DatabaseModule, ScheduleModule],
  providers: [
    OnCooperatorExitCheckEquipment,
    SendNotificationUseCase
  ],
})

export class EventModule { }