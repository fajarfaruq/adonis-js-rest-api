import Database from '@ioc:Adonis/Lucid/Database';
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Book from 'App/Models/Book'
import BookAuthor from 'App/Models/BookAuthor';

export default class extends BaseSeeder {
  public async run() {

    let books = await Database
      .insertQuery()
      .returning('id')
      .table(Book.table)
      .insert({ publisher_id: 1, title: 'Belajar Pemrograman PHP', description: 'Deskripsi Belajar Pemrograman PHP' });

    let bookId = books[0];
    await Database
      .table(BookAuthor.table)
      .multiInsert([{
        author_id: 1,
        book_id: bookId
      }, {
        author_id: 2,
        book_id: bookId
      }]);

    books = await Database
      .insertQuery()
      .returning('id')
      .table(Book.table)
      .insert({ publisher_id: 2, title: 'Belajar Pemrograman Python', description: 'Deskripsi Belajar Pemrograman Python' });

    bookId = books[0];
    await Database
      .table(BookAuthor.table)
      .multiInsert([{
        author_id: 1,
        book_id: bookId
      }]);

    books = await Database
      .insertQuery()
      .returning('id')
      .table(Book.table)
      .insert({ publisher_id: 2, title: 'Belajar Pemrograman Ruby', description: 'Deskripsi Belajar Pemrograman Ruby' });

    bookId = books[0];
    await Database
      .table(BookAuthor.table)
      .multiInsert([{
        author_id: 2,
        book_id: bookId
      }]);
  }
}
