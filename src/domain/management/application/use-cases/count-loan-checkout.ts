import { Either, right } from "@/core/either"
import { Injectable } from "@nestjs/common"
import { CredentialDoNotMatchError } from "./errors/credentials-not-match"
import { LoanRecordRepository } from "../repositories/loan-record-repository"

type CountLoanCheckoutUseCaseReponse = Either<CredentialDoNotMatchError, {
  amount: number
}>

@Injectable()
export class CountLoanCheckoutUseCase {
  constructor(
    private loanRecordRepository: LoanRecordRepository,
  ) { }
  async execute(): Promise<CountLoanCheckoutUseCaseReponse> {
    const toDay = new Date()
    const last30Days = new Date().setDate(toDay.getDate() - 30)

    const amount = await this.loanRecordRepository.count({ from: new Date(last30Days), status: "CHECK_OUT" })
    return right({
      amount
    })
  }
}