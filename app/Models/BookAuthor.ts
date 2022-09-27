import { BaseModel,
  column,
  hasMany,
  HasMany} from '@ioc:Adonis/Lucid/Orm';
import Book from './Book';
import Author from './Author';

/**
 * This class using for represent BookAuthors Table
 */
export default class BookAuthor extends BaseModel {
  public static table = 'book_authors'
  
  // Column book_authors.book_id has relation with books.book_id
  @column({columnName: 'book_id'})
  @hasMany(() => Book)
  public bookId: HasMany<typeof Book>;

  // Column book_authors.author_id has relation with authors.author_id
  @column({columnName: 'author_id'})
  @hasMany(() => Author)
  public authorId: HasMany<typeof Author>;

}
