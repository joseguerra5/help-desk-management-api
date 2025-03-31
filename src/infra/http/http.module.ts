import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
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
import { FetchLoanRecordByCooperatorIdUseCase } from '@/domain/management/application/use-cases/fetch-loan-record-by-cooperator-id';
import { FetchLoanRecordByCooperatorIdController } from './controllers/fetch-loan-records-by-cooperator-id.controller';
import { FetchCooperatorUseCase } from '@/domain/management/application/use-cases/fetch-cooperators';
import { FetchCooperatorController } from './controllers/fetch-cooperator.controller';
import { EditManagerController } from './controllers/edit-manager.controller';
import { EditManagerUseCase } from '@/domain/management/application/use-cases/edit-manager';
import { EditCooperatorUseCase } from '@/domain/management/application/use-cases/edit-cooperator';
import { EditCooperatorController } from './controllers/edit-cooperator.controller';
import { CreateCallLogController } from './controllers/create-call-log.controller';
import { CreateCallLogUseCase } from '@/domain/management/application/use-cases/create-call-log';
import { FetchCallLogsController } from './controllers/fetch-call-logs.controller';
import { FetchCallLogsUseCase } from '@/domain/management/application/use-cases/fetch-call-logs';
import { CountLoanCheckoutUseCase } from '@/domain/management/application/use-cases/count-loan-checkout';
import { CountLoanCheckInUseCase } from '@/domain/management/application/use-cases/count-loan-checkin';
import { GetCountLoanCheckInController } from './controllers/count-loan-checkin.controller';
import { FetchEquipmentsController } from './controllers/fetch-equipments.controller';
import { FetchEquipmentsUseCase } from '@/domain/management/application/use-cases/fetch-equipments';
import { FetchLoanRecordController } from './controllers/fetch-loan-records.controller';
import { FetchLoanRecordUseCase } from '@/domain/management/application/use-cases/fetch-loan-record';
import { GetManagerProfileController } from './controllers/get-profile.controller';
import { GetManagerProfileUseCase } from '@/domain/management/application/use-cases/get-manager-profile';
import { GetLoanRecordByIdController } from './controllers/get-loan-record-by-id.controller';
import { GetLoanRecordByIdUseCase } from '@/domain/management/application/use-cases/get-loan-record-by-id';
import { StorageModule } from '../storage/storage.module';
import { UploadAttachmentController } from './controllers/upload-attachment.controller';
import { UploadAndCreateAttachmentUseCase } from '@/domain/management/application/use-cases/upload-and-create-attachment';
import { GetAttachmentPresignedUrlController } from './controllers/get-presigned-attachment-url';
import { GetAttachmentPresignedUrlUseCase } from '@/domain/management/application/use-cases/get-attachment-presigned-url.use-case';
import { ReadNotificationController } from './controllers/read-notification.controller';
import { FetchNotificationByRecipientIdController } from './controllers/fetch-notifications.controller';
import { FetchNotificationsByRecipientIdUseCase } from '@/domain/notification/aplication/use-cases/fetch-notification';
import { ReadNotificationUseCase } from '@/domain/notification/aplication/use-cases/read-notification';
import { CountEquipmentsAvailableAndLoanedUseCase } from '@/domain/management/application/use-cases/count-equipments-loaned';
import { CountEquipmentsAvailableAndLoanedController } from './controllers/count-equipments-loaned.controller';
import { GetCountLoanCheckOutController } from './controllers/count-loan-checkout.controller';
import { CountCallLogsController } from './controllers/count-call-logs.controller';
import { CountCallLogsUseCase } from '@/domain/management/application/use-cases/count-call-logs';
import { GetQrCodeTo2faController } from './controllers/get-qr-code-to-2FA.controller';
import { GenerateSecretToTwoFactorAuthUseCase } from '@/domain/management/application/use-cases/generate-secret-two-factor';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { TwofaModule } from '../2fa/2fa.module';

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule, TwofaModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    RegisterCooperatorController,
    RegisterEquipmentController,
    EditInventoryController,
    RegisterEquipmentDamageController,
    RegisterDepartureDateController,
    LinkAttachmentToLoanRecordController,
    GetCooperatorByIdController,
    FetchLoanRecordByCooperatorIdController,
    FetchCooperatorController,
    EditManagerController,
    EditCooperatorController,
    CreateCallLogController,
    FetchCallLogsController,
    GetCountLoanCheckOutController,
    GetCountLoanCheckInController,
    FetchEquipmentsController,
    FetchLoanRecordController,
    GetManagerProfileController,
    GetLoanRecordByIdController,
    UploadAttachmentController,
    GetAttachmentPresignedUrlController,
    ReadNotificationController,
    FetchNotificationByRecipientIdController,
    CountEquipmentsAvailableAndLoanedController,
    CountCallLogsController,
    GetQrCodeTo2faController
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
    GetCooperatorByIdUseCase,
    FetchLoanRecordByCooperatorIdUseCase,
    FetchCooperatorUseCase,
    EditManagerUseCase,
    EditCooperatorUseCase,
    CreateCallLogUseCase,
    FetchCallLogsUseCase,
    CountLoanCheckoutUseCase,
    CountLoanCheckInUseCase,
    FetchEquipmentsUseCase,
    FetchLoanRecordUseCase,
    GetManagerProfileUseCase,
    GetLoanRecordByIdUseCase,
    UploadAndCreateAttachmentUseCase,
    GetAttachmentPresignedUrlUseCase,
    ReadNotificationUseCase,
    FetchNotificationsByRecipientIdUseCase,
    CountEquipmentsAvailableAndLoanedUseCase,
    CountCallLogsUseCase,
    GenerateSecretToTwoFactorAuthUseCase
  ],
})


export class HttpModule { }
