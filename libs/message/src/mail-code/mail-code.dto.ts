import { createI18nZodDto } from "@meta-1/nest-common";
import { SendCodeSchema } from "@meta-1/nest-types";

export class SendCodeDto extends createI18nZodDto(SendCodeSchema) {}
