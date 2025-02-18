import { Table, Column, DataType, ForeignKey, HasMany } from 'sequelize-typescript';

import { User } from '@/modules/user/entities/user.entity';
import { GalleryItem } from '@/modules/gallery_item/entities/gallery_item.entity';
import { Model } from '@/database/database.model';

@Table({ 
  tableName: 'galleries', 
  paranoid: true,
  underscored: true, // Enable underscored naming for columns
  timestamps: true, // Enable timestamps (createdAt and updatedAt)
})
export class Gallery extends Model {
  
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
    field: 'slug',
    type: DataType.STRING
  })
  slug: string;

  @Column({
    field: 'title',
    type: DataType.STRING
  })
  title: string;

  @Column({
    field: 'description',
    type: DataType.STRING
  })
  description: string;

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

  @HasMany(() => GalleryItem)
  items: GalleryItem[];
}
