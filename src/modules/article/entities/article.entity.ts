import moment from 'moment';
import { Table, Column, DataType, ForeignKey } from 'sequelize-typescript';

import { ArticleStatus } from '@/common/enums/article_status.enum';
import { User } from '@/modules/user/entities/user.entity';
import { Model } from '@/database/database.model';

@Table({ 
  tableName: 'articles', 
  paranoid: true,
  underscored: true, // Enable underscored naming for columns
  timestamps: true, // Enable timestamps (createdAt and updatedAt)
})
export class Article extends Model {
  
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
    field: 'content',
    type: DataType.STRING
  })
  content: string;

  @Column({
    field: 'status',
    type: DataType.STRING
  })
  status: ArticleStatus;

  @Column({
    field: 'published_at',
    type: DataType.DATE
  })
  publishedAt: string;

  @Column({
    field: 'tags',
    type: DataType.STRING,
    get() {
      const rawValue = this.getDataValue('tags');
      return rawValue ? rawValue.split(',') : [];
    },
    set(value: string[] | null) {
      this.setDataValue('tags', value ? value.join(',') : '');
    }
  })
  tags: string[];

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
