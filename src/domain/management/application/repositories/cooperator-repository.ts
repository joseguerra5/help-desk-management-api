import { PaginationCooperatorParams } from '@/core/repositories/pagination-param';
import { Cooperator } from '../../enterprise/entities/cooperator';
import { CooperatorDetails } from '../../enterprise/entities/value-objects/cooperator-with-details';

export interface FindManyCooperators {
  data: Cooperator[],
  meta: {
    totalCount: number,
    pageIndex: number,
    perPage: number,
  }
}
export abstract class CooperatorRepository {
  abstract create(cooperator: Cooperator): Promise<void>;
  abstract save(cooperator: Cooperator): Promise<void>;
  abstract findById(id: string): Promise<Cooperator | null>;
  abstract findMany(params: PaginationCooperatorParams): Promise<FindManyCooperators>;
  abstract findByEmail(email: string): Promise<Cooperator | null>;
  abstract findByEmployeeId(id: string): Promise<Cooperator | null>;
  abstract findByIdWithDetails(id: string): Promise<CooperatorDetails | null>
}
