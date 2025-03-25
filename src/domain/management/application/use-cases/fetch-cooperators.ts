import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { CooperatorRepository, FindManyCooperators } from '../repositories/cooperator-repository';

interface FetchCooperatorUseCaseRequest {
  page: number;
  status?: 'inactive' | 'active';
  search?: string;
  equipmentsStatus?: 'inactive' | 'active';
}

type FetchCooperatorUseCaseReponse = Either<
  null,
  FindManyCooperators
>;

@Injectable()
export class FetchCooperatorUseCase {
  constructor(private cooperatorRepository: CooperatorRepository) { }
  async execute({
    page,
    status,
    search,
    equipmentsStatus
  }: FetchCooperatorUseCaseRequest): Promise<FetchCooperatorUseCaseReponse> {
    const cooperators = await this.cooperatorRepository.findMany({
      page,
      status,
      search,
      equipmentsStatus
    });

    return right({
      data: cooperators.data,
      meta: {
        pageIndex: cooperators.meta.pageIndex,
        perPage: cooperators.meta.perPage,
        totalCount: cooperators.meta.totalCount
      }
    });
  }
}
