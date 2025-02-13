import { Table, Column, DataType, Model, BelongsToMany, ForeignKey, HasMany } from 'sequelize-typescript';

@Table({ 
  tableName: 'medias', 
  paranoid: true,
  underscored: true, // Enable underscored naming for columns
  timestamps: true, // Enable timestamps (createdAt and updatedAt)
})
export class Media extends Model {
  
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
    field: 'data',
    type: DataType.BLOB
  })
  data: Buffer;

  @Column({
    field: 'mimetype',
    type: DataType.STRING
  })
  mimetype: string;

  @Column({
    field: 'last_access_at',
    type: DataType.DATE
  })
  lastAccessAt: string;
}
