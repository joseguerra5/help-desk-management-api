import { EquipmentType } from '@/domain/management/enterprise/entities/equipment';
import { RecordType } from '@/domain/management/enterprise/entities/loan-record';

export interface PaginationParams {
  page: number;
}

export interface PaginationLoanRecordParams {
  page: number;
  status?: RecordType;
}

export interface PaginationCooperatorParams {
  page: number;
  status?: 'inactive' | 'active';
  search?: string;
}

export interface PaginationEquipmentsParams {
  page: number;
  status?: "broken" | "available" | "loaned"
  search?: string;
  type?: EquipmentType
  cooperatorId?: string
}

