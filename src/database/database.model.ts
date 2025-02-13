import { Model as BaseModel } from "sequelize-typescript"

export class Model extends BaseModel {

  public static getTransaction() {
    return this.sequelize.transaction();
  }
}