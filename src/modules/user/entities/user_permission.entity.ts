import { Table, Column, DataType, ForeignKey } from 'sequelize-typescript';
import { User } from './user.entity';
import { Permission } from './permission.entity';
import { Model } from '@/database/database.model';


@Table({ 
  tableName: 'user_permissions',  
  timestamps: false,
  underscored: true, // Enable underscored naming for columns
})
export class UserPermission extends Model {
  
  @ForeignKey(() => User)
  @Column({
    field: 'user_id',
    type: DataType.BIGINT.UNSIGNED
  })
  userId: number;

  @ForeignKey(() => Permission)
  @Column({
    field: 'permission_id',
    type: DataType.BIGINT.UNSIGNED
  })
  permissionId: number;
}
