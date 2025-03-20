import { DomainEvents } from '@/core/events/domain-events';
import { PaginationCooperatorParams } from '@/core/repositories/pagination-param';
import { CooperatorRepository, FindManyCooperators } from '@/domain/management/application/repositories/cooperator-repository';
import { Cooperator } from '@/domain/management/enterprise/entities/cooperator';
import { CooperatorDetails } from '@/domain/management/enterprise/entities/value-objects/cooperator-with-details';
import { InMemoryCallLogRepository } from './in-memory-call-log-repository';
import { InMemoryEquipmentRepository } from './in-memory-equipments-repository';
import { Equipment, EquipmentType } from '@/domain/management/enterprise/entities/equipment';
import { CallLog } from '@/domain/management/enterprise/entities/callLog';

export class InMemoryCooperatorRepository implements CooperatorRepository {
  constructor(
    private inMemoryCallLogRepository: InMemoryCallLogRepository,
    private inMemoryEquipmentRepository: InMemoryEquipmentRepository
  ) { }
  public items: Cooperator[] = [];

  async findByIdWithDetails(id: string): Promise<CooperatorDetails | null> {
    const cooperator = this.items.find((item) => item.id.toString() === id);

    if (!cooperator) {
      return null;
    }

    const callLogs = this.inMemoryCallLogRepository.items
      .filter((log) => log.cooperatorId.equals(cooperator.id))
      .map((log) => CallLog.create({
        madeBy: log.madeBy,
        cooperatorId: log.cooperatorId,
        type: log.type,
        description: log.description,
        createdAt: log.createdAt,
        updatedAt: log.updatedAt
      }));

    const equipments = this.inMemoryEquipmentRepository.items
      .filter((equipment) => equipment.cooperatorId === cooperator.id.toString())
      .map((equipment) => Equipment.create({
        name: equipment.name,
        type: equipment.type as EquipmentType,
        serialNumber: equipment.serialNumber,
        createdAt: equipment.createdAt,
      }));

    return CooperatorDetails.create({
      cooperatorId: cooperator.id,
      name: cooperator.name,
      userName: cooperator.userName,
      employeeId: cooperator.employeeId,
      nif: cooperator.nif,
      phone: cooperator.phone,
      email: cooperator.email,
      createdAt: cooperator.createdAt,
      departureDate: cooperator.departureDate,
      updatedAt: cooperator.updatedAt,
      inventory: equipments,
      callLogs: callLogs
    });
  }



  async findMany({
    page,
    search,
    status,
  }: PaginationCooperatorParams): Promise<FindManyCooperators> {
    let filteredItems = this.items;

    if (search) {
      filteredItems = filteredItems.filter(
        (item) =>
          item.employeeId.toLowerCase().includes(search.toLowerCase()) ||
          item.userName.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (status === 'inactive') {
      filteredItems = filteredItems.filter((item) => item.departureDate !== null);
    } else if (status === 'active') {
      filteredItems = filteredItems.filter((item) => item.departureDate === null);
    }

    // Ordenação por data de criação antes da paginação
    filteredItems = filteredItems.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );

    // Paginação
    const startIndex = (page - 1) * 20;
    const endIndex = page * 20;
    const paginatedItems = filteredItems.slice(startIndex, endIndex);

    return {
      data: paginatedItems.map((cooperator) => {
        const callLogs = this.inMemoryCallLogRepository.items
          .filter((callLog) => callLog.cooperatorId.equals(cooperator.id))
          .map((log) =>
            CallLog.create({
              madeBy: log.madeBy,
              updatedAt: log.updatedAt,
              cooperatorId: log.cooperatorId,
              type: log.type,
              description: log.description,
              createdAt: log.createdAt,
            }),
          );

        const equipments = this.inMemoryEquipmentRepository.items
          .filter((equipment) => equipment.cooperatorId === cooperator.id.toString())
          .map((equipment) =>
            Equipment.create({
              brokenAt: equipment.brokenAt,
              brokenReason: equipment.brokenReason,
              name: equipment.name,
              type: equipment.type as EquipmentType,
              serialNumber: equipment.serialNumber,
              createdAt: equipment.createdAt,
            }),
          );

        return CooperatorDetails.create({
          cooperatorId: cooperator.id,
          name: cooperator.name,
          userName: cooperator.userName,
          employeeId: cooperator.employeeId,
          nif: cooperator.nif,
          phone: cooperator.phone,
          email: cooperator.email,
          createdAt: cooperator.createdAt,
          departureDate: cooperator.departureDate,
          updatedAt: cooperator.updatedAt,
          inventory: equipments,
          callLogs: callLogs,
        });
      }),
      meta: {
        pageIndex: page,
        perPage: 20,
        totalCount: this.items.length,
      },
    };
  }

  async save(cooperator: Cooperator): Promise<void> {
    const itemIndex = this.items.findIndex((item) =>
      item.id.equals(cooperator.id),
    );

    this.items[itemIndex] = cooperator;


    DomainEvents.dispatchEventsForAggregate(cooperator.id)
  }

  async findById(id: string): Promise<Cooperator | null> {
    const cooperator = this.items.find((item) => item.id.toString() === id);

    if (!cooperator) {
      return null;
    }

    return cooperator;
  }

  async create(cooperator: Cooperator): Promise<void> {
    this.items.push(cooperator);
  }
  async findByEmail(email: string): Promise<Cooperator | null> {
    const cooperator = this.items.find((item) => item.email === email);

    if (!cooperator) {
      return null;
    }

    return cooperator;
  }
  async findByEmployeeId(id: string): Promise<Cooperator | null> {
    const cooperator = this.items.find(
      (item) => item.employeeId.toString() === id,
    );

    if (!cooperator) {
      return null;
    }

    return cooperator;
  }
}
