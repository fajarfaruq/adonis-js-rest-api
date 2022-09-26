import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Author from 'App/Models/Author'

export default class extends BaseSeeder {
  public async run() {
    let authors = await Author.findBy('author_id', 1);
    await authors?.delete();

    authors = await Author.findBy('author_id', 2);
    await authors?.delete();
    
    await Author.createMany([
      {
        authorId: 1,
        name: 'Lukmanul Hakim',
        description: 'Author of the book Lukamnul Hakim',
      },
      {
        authorId: 2,
        name: 'Hadi Sucipto',
        description: 'Author Of the book Hadi Sucipto',
      }
    ])
  }
}
