import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import Database from '@ioc:Adonis/Lucid/Database';
import Author from 'App/Models/Author';
import Book from 'App/Models/Book';
import BookAuthor from 'App/Models/BookAuthor';
import Publisher from 'App/Models/Publisher';

/**
 * This class using for manage books and book_authors 
 */
export default class BooksController {
    /**
     * Function getAll using for show all book
     * 
     * @param  {HttpContextContract} {response}
     */
    public async getAll({ response }: HttpContextContract) {

        const books = await Database
            .from(Book.table)
            .join('publishers', 'books.publisher_id', '=', 'publishers.publisher_id')
            .select('books.*')
            .select('publishers.name as publisher_name')
            .select('publishers.description as publisher_description')
        
        return response
            .status(200)
            .json({ code: 200, status: "success", data: books });
    }
    /**
     * Function getById using for get data book by Id
     * 
     * @param  {} {params   Containts param id as book_id
     * @param  {HttpContextContract} response}
     */
    public async getById({ params, response }: HttpContextContract) {
        try {

            // Query for manage book
            const books = await Database
                .from(Book.table)
                .join('publishers', 'books.publisher_id', '=', 'publishers.publisher_id')
                .select('books.*')
                .select('publishers.name as publisher_name')
                .select('publishers.description as publisher_description')
                .where('books.book_id', '=', params.id)
                .first()
            
            if (books == null) {
                return response.status(404).json({ code: 404, status: 'Data Not Found', data: null });
            }

            // Join with book author result
            const bookAuthors = await Database
                    .from(BookAuthor.table)
                    .join('authors', 'book_authors.author_id', '=', 'authors.author_id')
                    .select('book_authors.*')
                    .select('authors.name as author_name')
                    .where('book_authors.book_id', '=', params.id);
            
            books['authors'] = bookAuthors;

            return response.status(200).json({ code: 200, status: 'success', data: books });
        } catch (err) {
            return response.status(500).json({ code: 500, status: 'error', message: err.messages });
        }
    }
    /**
     * Function getByName using for get data book by name
     * 
     * @param  {} {params Containts param name as book_name
     * @param  {HttpContextContract} response}
     */
    public async getByName({ params, response }: HttpContextContract) {
        try {
            const books = await Database
                .from(Book.table)
                .join('publishers', 'books.publisher_id', '=', 'publishers.publisher_id')
                .select('books.*')
                .select('publishers.name as publisher_name')
                .select('publishers.description as publisher_description')
                .where('title', 'LIKE', '%' + params.name + '%');

            if (books == null) {
                return response.status(404).json({ code: 404, status: 'Data Not Found', data: null });
            }

            return response.status(200).json({ code: 200, status: 'success', data: books });
        } catch (err) {
            return response.status(500).json({ code: 500, status: 'error', message: err.messages });
        }
    }
    /**
     * Function create using for insert new record to book and book_author
     * 
     * @param  {} {request Containts JSON payload which sent from API
     * @param  {HttpContextContract} response}
     */
    public async create({ request, response }: HttpContextContract) {
        // Wrap with begin transaction to avoid insert mistake 
        const trx = await Database.transaction()
        try {
            // Validate JSON Payload
            const newPostSchema = schema.create({
                publisher_id: schema.number([rules.exists({ table: Publisher.table, column: 'publisher_id' })]),
                title: schema.string({ trim: true }, [rules.minLength(3), rules.maxLength(50)]),
                description: schema.string(),
                authors: schema.array().members(
                    schema.object().members({
                        author_id: schema.number([rules.exists({ table: Author.table, column: 'author_id' })])
                    })
                ),
            });

            const messages = {
                minLength: '{{ field }} must be at least {{ options.minLength }} characters long',
                maxLength: '{{ field }} cannot be longer than {{ options.maxLength }} characters long',
                exists: '{{ field }} not found in relation table',
                object: 'Something wrong in this field'
            };

            const payload = await request.validate({ schema: newPostSchema, messages });

            // Check publisher existing or not
            const publishers = await Publisher.query().where('publisher_id', '=', payload.publisher_id).first();
            if (publishers == null) {
                await trx.rollback();
                return response.status(404).json({ code: 404, status: 'Publisher ' + payload.publisher_id + ' Not Found', data: null });
            }

            // Insert into books table
            const books = await Database
                .insertQuery()
                .returning('id')
                .table(Book.table)
                .useTransaction(trx)
                .insert({ publisher_id: payload.publisher_id, title: payload.title, description: payload.description });

            // Get last insert book_id
            const bookId = books[0];

            // Insert into bookauthor 
            await Database
                .table(BookAuthor.table)
                .multiInsert(payload.authors.map(pAturhor => {
                    return {
                        author_id: pAturhor.author_id,
                        book_id: bookId
                    };
                }))
                .useTransaction(trx);

            await trx.commit();
            
            // return new record
            const booksDetail = await Book.query().where('book_id', '=', bookId).first();

            return response.status(200).json({ code: 200, status: 'success', data: booksDetail });
        } catch (err) {
            await trx.rollback();
            return response.status(500).json({ code: 500, status: 'error', message: err.messages });
        }
    }
    /**
     * Function update using for update book by id
     * 
     * @param  {} {params  Containts param id as book_id
     * @param  {} request Containts JSON payload which sent from API
     * @param  {HttpContextContract} response}
     */
    public async update({ params, request, response }: HttpContextContract) {
        // Wrap with begin transaction to avoid insert mistake 
        const trx = await Database.transaction()
        try {
            // Validate JSON Payload
            const newPostSchema = schema.create({
                publisher_id: schema.number([rules.exists({ table: Publisher.table, column: 'publisher_id' })]),
                title: schema.string({ trim: true }, [rules.minLength(3), rules.maxLength(50)]),
                description: schema.string(),
                authors: schema.array().members(
                    schema.object().members({
                        author_id: schema.number([rules.exists({ table: Author.table, column: 'author_id' })])
                    })
                ),
            });

            const messages = {
                minLength: '{{ field }} must be at least {{ options.minLength }} characters long',
                maxLength: '{{ field }} cannot be longer than {{ options.maxLength }} characters long',
                exists: '{{ field }} not found in relation table',
                object: 'Something wrong in this field'
            };

            const payload = await request.validate({ schema: newPostSchema, messages });
            const bookId = params.id;

            // Check book is exist
            const books = await Book.query().where('book_id', '=', bookId).first();
            if (books == null) {
                await trx.rollback();
                return response.status(404).json({ code: 404, status: 'Book ' + bookId + ' Not Found', data: null });
            }

            // Check publisher is exist
            const publishers = await Publisher.query().where('publisher_id', '=', payload.publisher_id).first();
            if (publishers == null) {
                await trx.rollback();
                return response.status(404).json({ code: 404, status: 'Publisher ' + payload.publisher_id + ' Not Found', data: null });
            }

            // Update table book by id
            await Database
                .from(Book.table)
                .useTransaction(trx)
                .update({ publisher_id: payload.publisher_id, title: payload.title, description: payload.description })
                .where('book_id', bookId);

            // Delete all bookauthor by book id to refresh book author data
            await Database.from(BookAuthor.table).where('book_id', bookId).delete();

            // New insert book author from payload
            await Database
                .table(BookAuthor.table)
                .multiInsert(payload.authors.map(pAturhor => {
                    return {
                        author_id: pAturhor.author_id,
                        book_id: bookId
                    };
                }))
                .useTransaction(trx);

            await trx.commit();

            // return updated record
            const booksDetail = await Book.query().where('book_id', '=', bookId).first();

            return response.status(200).json({ code: 200, status: 'success', data: booksDetail });
        } catch (err) {
            await trx.rollback();
            return response.status(500).json({ code: 500, status: 'error', message: err.messages });
        }
    }

    /**
     * Function delete using for delete books and bookauthors by book_id
     * 
     * @param  {} {params Containts param id as book_id
     * @param  {HttpContextContract} response}
     */
    public async delete({ params, response }: HttpContextContract) {
        const trx = await Database.transaction()
        try {
            const books = await Book.findBy('book_id', params.id);
            if (books == null) {
                await trx.rollback();
                return response.status(404).json({ code: 404, status: 'Data Not Found', data: null });
            }
            // 1st delete book author by book id
            await Database.from(BookAuthor.table).where('book_id', params.id).delete();

            // 2nd delete book by book id
            await Database.from(Book.table).where('book_id', params.id).delete();

            await trx.commit();

            return response.status(200).json({ code: 200, status: 'success', data: books });
        } catch (err) {
            await trx.rollback();
            return response.status(500).json({ code: 500, status: 'error', message: err.message });
        }
    }
}
