import { Module } from "@nestjs/common";
import { StaffController } from "./staff.controller";
import { providers } from "./staff.provider";

@Module({
  imports: [],
  controllers: [StaffController],
  providers: [...providers]
})
export class StaffModule {}
