import { Table, Column, DataType, BelongsToMany } from 'sequelize-typescript';
import { Permission } from './permission.entity';
import { RolePermission } from './role_permission.entity';
import { UserRole } from '@/common/enums/user_role.enum';
import { Model } from '@/database/database.model';

@Table({ 
  tableName: 'roles',  
  timestamps: false,
  underscored: true, // Enable underscored naming for columns
})
export class Role extends Model {
  
  @Column({
    type: DataType.BIGINT.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  })
  id: number;

  @Column({
    field: 'name',
    type: DataType.STRING
  })
  name: UserRole;
  
  @BelongsToMany(() => Permission, () => RolePermission)
  permissions: Permission[];
}
