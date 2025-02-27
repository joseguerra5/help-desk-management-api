import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { CreateAccountController } from './controllers/create-account.controller';
import { RegisterManagerUseCase } from '@/domain/management/application/use-cases/register-manager';
import { AuthenticateController } from './controllers/authenticate.controller';
import { AuthenticateManagerUseCase } from '@/domain/management/application/use-cases/authenticate-manager';
import { RegisterCooperatorController } from './controllers/register-cooperator.controller';
import { RegisterCooperatorUseCase } from '@/domain/management/application/use-cases/register-cooperator';
import { RegisterEquipmentController } from './controllers/register-equipment.controller';
import { RegisterEquipmentUseCase } from '@/domain/management/application/use-cases/register-equipment';
import { RegisterInventoryUseCase } from '@/domain/management/application/use-cases/register-inventory-equipments';
import { EditInventoryController } from './controllers/edit-inventory.controller';
import { RegisterEquipmentDamageUseCase } from '@/domain/management/application/use-cases/register-equipment-damage';
import { RegisterEquipmentDamageController } from './controllers/register-equipment-damage.controller';
import { RegisterDepartureDateController } from './controllers/register-departure-date.controller';
import { RegisterDepartureDateUseCase } from '@/domain/management/application/use-cases/register-departure-date';
import { LinkAttachmentToLoanRecordUseCase } from '@/domain/management/application/use-cases/link-attachment-to-loan-record';
import { LinkAttachmentToLoanRecordController } from './controllers/link-attachment-to-loan-record.controller';
import { GetCooperatorByIdController } from './controllers/get-cooperator.controller';
import { GetCooperatorByIdUseCase } from '@/domain/management/application/use-cases/get-cooperator-by-id';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    RegisterCooperatorController,
    RegisterEquipmentController,
    EditInventoryController,
    RegisterEquipmentDamageController,
    RegisterDepartureDateController,
    LinkAttachmentToLoanRecordController,
    GetCooperatorByIdController
  ],
  providers: [
    RegisterManagerUseCase,
    AuthenticateManagerUseCase,
    RegisterCooperatorUseCase,
    RegisterEquipmentUseCase,
    RegisterInventoryUseCase,
    RegisterEquipmentDamageUseCase,
    RegisterDepartureDateUseCase,
    LinkAttachmentToLoanRecordUseCase,
    GetCooperatorByIdUseCase
  ],
})


export class HttpModule { }
