import { Either, left, right } from '@/core/either';
import { AlreadyExistsError } from './errors/already-exist-error';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { LoanRecord } from '../../enterprise/entities/loan-record';
import { LoanRecordRepository } from '../repositories/loan-record-repository';
import { PDFAttachment } from '../../enterprise/entities/PDF-attachment';
import { CooperatorRepository } from '../repositories/cooperator-repository';

interface LinkAttachmentToLoanRecordUseCaseRequest {
  attachmentId: string;
  cooperatorId: string;
  loanRecordId: string;
}

type LinkAttachmentToLoanRecordUseCaseReponse = Either<
  AlreadyExistsError,
  {
    loanRecord: LoanRecord;
  }
>;

@Injectable()
export class LinkAttachmentToLoanRecordUseCase {
  constructor(
    private loanRecordRepository: LoanRecordRepository,
    private cooperatorRepository: CooperatorRepository,
  ) { }
  async execute({
    attachmentId,
    cooperatorId,
    loanRecordId,
  }: LinkAttachmentToLoanRecordUseCaseRequest): Promise<LinkAttachmentToLoanRecordUseCaseReponse> {
    const loanRecord = await this.loanRecordRepository.findById(loanRecordId);

    if (!loanRecord) {
      return left(new ResourceNotFoundError('Loan Record', loanRecordId));
    }

    const cooperator = await this.cooperatorRepository.findById(cooperatorId);

    if (!cooperator) {
      return left(new ResourceNotFoundError('Cooperator', cooperatorId));
    }

    const loanRecordAttachment = PDFAttachment.create({
      attachmentId: new UniqueEntityId(attachmentId),
      cooperatorId: new UniqueEntityId(cooperatorId),
      loanRecordId: new UniqueEntityId(loanRecordId),
    });

    loanRecord.attachment = loanRecordAttachment;

    await this.loanRecordRepository.save(loanRecord);

    return right({
      loanRecord,
    });
  }
}
