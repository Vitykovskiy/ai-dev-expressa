import { Transform } from 'class-transformer';
import { IsIn, IsOptional, IsString, Matches, ValidateIf } from 'class-validator';
import type { BackofficeBootstrapMode } from '@expressa/shared-types';

export class BackofficeAccessBootstrapRequestDto {
  @IsIn(['telegram', 'test'])
  mode!: BackofficeBootstrapMode;

  @IsOptional()
  @IsString()
  telegramInitData?: string;

  @ValidateIf((value: BackofficeAccessBootstrapRequestDto) => value.testTelegramId !== undefined)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @Matches(/^\d+$/)
  testTelegramId?: string;
}
