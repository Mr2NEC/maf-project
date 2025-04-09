import { Module } from '@nestjs/common';
import { DateUtils } from './utils/date.utils';
import { StringUtils } from './utils/string.utils';
import { ValidationUtils } from './utils/validation.utils';

@Module({
  providers: [DateUtils, StringUtils, ValidationUtils],
  exports: [DateUtils, StringUtils, ValidationUtils],
})
export class SharedModule {}
