import { Table, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';

import { User } from '@/modules/user/entities/user.entity';
import { Gallery } from './gallery.entity';
import { Media } from '@/modules/media/entities/media.entity';
import { Model } from '@/database/database.model';

@Table({ 
  tableName: 'gallery_items', 
  paranoid: true,
  underscored: true, // Enable underscored naming for columns
  timestamps: true, // Enable timestamps (createdAt and updatedAt)
})
export class GalleryItem extends Model {
  
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

  @ForeignKey(() => Gallery)
  @Column({
    field: 'gallery_id',
    type: DataType.BIGINT.UNSIGNED
  })
  galleryId: number;

  @ForeignKey(() => Media)
  @Column({
    field: 'media_id',
    type: DataType.BIGINT.UNSIGNED
  })
  mediaId: number;

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

  @Column({
    field: 'caption',
    type: DataType.STRING
  })
  caption: string;

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

  @BelongsTo(() => Media)
  media: Media;
}
