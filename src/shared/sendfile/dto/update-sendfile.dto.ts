import { PartialType } from '@nestjs/mapped-types';
import { CreateSendfileDto } from './create-sendfile.dto';

export class UpdateSendfileDto extends PartialType(CreateSendfileDto) {}
