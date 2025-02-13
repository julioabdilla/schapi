import { Table, Column, DataType, ForeignKey } from 'sequelize-typescript';
import { Permission } from './permission.entity';
import { Role } from './role.entity';
import { Model } from '@/database/database.model';


@Table({ 
  tableName: 'role_permissions',  
  timestamps: false,
  underscored: true, // Enable underscored naming for columns
})
export class RolePermission extends Model {
  
  @ForeignKey(() => Role)
  @Column({
    field: 'role_id',
    type: DataType.BIGINT.UNSIGNED
  })
  roleId: number;

  @ForeignKey(() => Permission)
  @Column({
    field: 'permission_id',
    type: DataType.BIGINT.UNSIGNED
  })
  permissionId: number;
}
