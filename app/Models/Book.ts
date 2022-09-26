import { BaseModel, column,
  hasMany,
  HasMany} from '@ioc:Adonis/Lucid/Orm'
import Publisher from './Publisher';

export default class Book extends BaseModel {
  public static table = 'books'
  
  @column({columnName: 'book_id', isPrimary: true })
  public id: number

  @column({columnName: 'publisher_id'})
  @hasMany(() => Publisher)
  public publisherId: HasMany<typeof Publisher>;

  @column({columnName: 'title'})
  public title: string

  @column({columnName: 'description'})
  public description: string
}
