import { IsString, IsOptional, IsObject } from 'class-validator';

export class CreateWebhookDto {
  @IsString()
  source: string;

  @IsString()
  event: string;

  @IsObject()
  @IsOptional()
  payload?: Record<string, unknown>;
}

export class UpdateWebhookDto {
  @IsString()
  @IsOptional()
  source?: string;

  @IsString()
  @IsOptional()
  event?: string;

  @IsObject()
  @IsOptional()
  payload?: Record<string, unknown>;
}
