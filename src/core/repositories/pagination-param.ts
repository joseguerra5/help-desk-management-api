import { RecordType } from "@/domain/management/enterprise/entities/loan-record"

export interface PaginationParams {
  page: number
}

export interface PaginationLoanRecordParams {
  page: number
  status?: RecordType
}

export interface PaginationCooperatorParams {
  page: number
  status?: "inactive" | "active"
  search?: string
}


