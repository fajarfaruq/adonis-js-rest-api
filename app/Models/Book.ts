import { BaseModel, column,
  hasMany,
  HasMany} from '@ioc:Adonis/Lucid/Orm'
import Publisher from './Publisher';

/**
 * This class using for represent Books Table
 */
export default class Book extends BaseModel {
  public static table = 'books'
  
  @column({columnName: 'book_id', isPrimary: true })
  public id: number

  // Column publisher_id has relation with table publishers.publisher_id
  @column({columnName: 'publisher_id'})
  @hasMany(() => Publisher)
  public publisherId: HasMany<typeof Publisher>;

  @column({columnName: 'title'})
  public title: string

  @column({columnName: 'description'})
  public description: string
}
