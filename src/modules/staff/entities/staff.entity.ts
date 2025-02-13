import { Table, Column, DataType, ForeignKey } from 'sequelize-typescript';

import { User } from '@/modules/user/entities/user.entity';
import { Model } from '@/database/database.model';

@Table({ 
  tableName: 'staffs', 
  paranoid: true,
  underscored: true, // Enable underscored naming for columns
  timestamps: true, // Enable timestamps (createdAt and updatedAt)
})
export class Staff extends Model {
  
  @Column({
    type: DataType.BIGINT.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  })
  id: number;

  @Column({
    field: 'uuid',
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4
  })
  uuid: string;

  @Column({
    field: 'name',
    type: DataType.STRING
  })
  name: string;

  @Column({
    field: 'image_url',
    type: DataType.STRING
  })
  imageUrl: string;

  @Column({
    field: 'image_binary',
    type: DataType.BLOB
  })
  imageData: Buffer;

  @ForeignKey(() => User)
  @Column({
    field: 'created_by',
    type: DataType.BIGINT.UNSIGNED
  })
  createdBy: number;

  @ForeignKey(() => User)
  @Column({
    field: 'updated_by',
    type: DataType.BIGINT.UNSIGNED
  })
  updatedBy: number;

  @ForeignKey(() => User)
  @Column({
    field: 'deleted_by',
    type: DataType.BIGINT.UNSIGNED
  })
  deletedBy: number;
}
