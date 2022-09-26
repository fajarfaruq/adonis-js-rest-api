import { BaseModel,
  column,
  hasMany,
  HasMany} from '@ioc:Adonis/Lucid/Orm';
import Book from './Book';
import Author from './Author';

export default class BookAuthor extends BaseModel {
  public static table = 'book_authors'
  
  @column({columnName: 'book_id'})
  @hasMany(() => Book)
  public bookId: HasMany<typeof Book>;

  @column({columnName: 'author_id'})
  @hasMany(() => Author)
  public authorId: HasMany<typeof Author>;

}
