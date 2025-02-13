import { SetMetadata } from "@nestjs/common";
import { ClassConstructor } from "class-transformer";

export const ResponseModel = (model: ClassConstructor<unknown>) => SetMetadata('ResponseModel', model);
