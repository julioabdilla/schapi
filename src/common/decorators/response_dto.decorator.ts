import { SetMetadata } from "@nestjs/common";
import { ClassConstructor } from "class-transformer";

export const UseResponseDto = (model: ClassConstructor<unknown>) => SetMetadata('UseResponseDto', model);
