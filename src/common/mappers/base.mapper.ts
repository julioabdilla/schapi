import { Model } from "sequelize-typescript";
import { BaseDto } from "../dto/base.dto";

export abstract class BaseMapper<T extends Model, U extends BaseDto> {

  entitiesToDto(entities: T[]): U[] {
    return entities.map(entity => this.entityToDto(entity));
  };
  public entityToDto(entity: T): U {
    return
  };
}