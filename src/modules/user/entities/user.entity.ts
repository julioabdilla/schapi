import { Table, Column, DataType, BelongsToMany, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { UserPermission } from './user_permission.entity';
import { Permission } from './permission.entity';
import { Role } from './role.entity';
import { Model } from '@/database/database.model';


@Table({ 
  tableName: 'users', 
  paranoid: true,
  underscored: true, // Enable underscored naming for columns
  timestamps: true, // Enable timestamps (createdAt and updatedAt)
})
export class User extends Model {
  
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
    field: 'username',
    type: DataType.STRING
  })
  username: string;

  @Column({
    field: 'password',
    type: DataType.STRING
  })
  password: string;

  @ForeignKey(() => Role)
  @Column({
    field: 'role_id',
    type: DataType.BIGINT.UNSIGNED
  })
  roleId: number;

  @BelongsToMany(() => Permission, () => UserPermission)
  additionalPermissions: Permission[];

  @BelongsTo(() => Role)
  role: Role;
}
