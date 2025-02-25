import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { CooperatorEquipmentRepository } from "@/domain/management/application/repositories/cooperator-equipment-repository";
import { CooperatorEquipment } from "@/domain/management/enterprise/entities/cooperator-equipment";

@Injectable()
export class PrismaCooperatorEquipmentRepository implements CooperatorEquipmentRepository {
  constructor(private prisma: PrismaService) { }
  findManyByCooperatorId(cooperatorId: string): Promise<CooperatorEquipment[]> {
    throw new Error("Method not implemented.");
  }
  deleteManyByCooperatorId(cooperatorId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  createMany(equipments: CooperatorEquipment[]): Promise<void> {
    throw new Error("Method not implemented.");
  }
  deleteMany(equipments: CooperatorEquipment[]): Promise<void> {
    throw new Error("Method not implemented.");
  }
}