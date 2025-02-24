import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Cooperator } from '../../enterprise/entities/cooperator'
import { CooperatorRepository } from '../repositories/cooperator-repository'

interface FetchCooperatorUseCaseRequest {
  page: number
  status?: "inactive" | "active"
  search?: string
}

type FetchCooperatorUseCaseReponse = Either<
  null,
  {
    cooperators: Cooperator[]
  }
>

@Injectable()
export class FetchCooperatorUseCase {
  constructor(
    private cooperatorRepository: CooperatorRepository,
  ) { }
  async execute({
    page,
    status,
    search
  }: FetchCooperatorUseCaseRequest): Promise<FetchCooperatorUseCaseReponse> {
    const cooperators =
      await this.cooperatorRepository.findMany(
        { page, status, search },
      )

    return right({
      cooperators,
    })
  }
}
