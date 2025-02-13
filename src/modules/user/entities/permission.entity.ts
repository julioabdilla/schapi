import { Model } from '@/database/database.model';
import { Table, Column, DataType } from 'sequelize-typescript';

@Table({ 
  tableName: 'permissions', 
  timestamps: false,
  underscored: true, // Enable underscored naming for columns
})
export class Permission extends Model {
  
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
  name: string;
}
