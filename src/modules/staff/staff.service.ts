import { Inject, Injectable } from "@nestjs/common";
import { Staff } from "./entities/staff.entity";

@Injectable()
export class StaffService {

  constructor(
    @Inject(Staff.name)
    private readonly staffRepository: typeof Staff,
  ) {}
}
