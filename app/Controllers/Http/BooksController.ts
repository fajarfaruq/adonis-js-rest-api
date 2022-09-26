import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import Database from '@ioc:Adonis/Lucid/Database';
import Author from 'App/Models/Author';
import Book from 'App/Models/Book';
import BookAuthor from 'App/Models/BookAuthor';
import Publisher from 'App/Models/Publisher';


export default class BooksController {
    public async getAll({ response }: HttpContextContract) {
        const books = await Book.all();

        return response
            .status(200)
            .json({ code: 200, status: "success", data: books });
    }

    public async getById({ params, response }: HttpContextContract) {
        try {
            const books = await Book.query().where('id', '=', params.id).first();
            if (books == null) {
                return response.status(404).json({ code: 404, status: 'Data Not Found', data: null });
            }
            return response.status(200).json({ code: 200, status: 'success', data: books });
        } catch (err) {
            return response.status(500).json({ code: 500, status: 'error', message: err.messages });
        }
    }

    public async getByName({ params, response }: HttpContextContract) {
        try {
            const books = await Book.query().where('title', 'LIKE', '%' + params.name + '%');
            if (books == null) {
                return response.status(404).json({ code: 404, status: 'Data Not Found', data: null });
            }
            return response.status(200).json({ code: 200, status: 'success', data: books });
        } catch (err) {
            return response.status(500).json({ code: 500, status: 'error', message: err.messages });
        }
    }

    public async create({ request, response }: HttpContextContract) {
        const trx = await Database.transaction()
        try {
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

            const publishers = await Publisher.query().where('publisher_id', '=', payload.publisher_id).first();
            if (publishers == null) {
                await trx.rollback();
                return response.status(404).json({ code: 404, status: 'Publisher ' + payload.publisher_id + ' Not Found', data: null });
            }

            const books = await Database
                .insertQuery()
                .returning('id')
                .table(Book.table)
                .useTransaction(trx)
                .insert({ publisher_id: payload.publisher_id, title: payload.title, description: payload.description });

            const bookId = books[0];
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

            const booksDetail = await Book.query().where('book_id', '=', bookId).first();

            return response.status(200).json({ code: 200, status: 'success', data: booksDetail });
        } catch (err) {
            await trx.rollback();
            return response.status(500).json({ code: 500, status: 'error', message: err.messages });
        }
    }

    public async update({ params, request, response }: HttpContextContract) {
        const trx = await Database.transaction()
        try {
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

            const books = await Book.query().where('book_id', '=', bookId).first();
            if (books == null) {
                await trx.rollback();
                return response.status(404).json({ code: 404, status: 'Book ' + bookId + ' Not Found', data: null });
            }

            const publishers = await Publisher.query().where('publisher_id', '=', payload.publisher_id).first();
            if (publishers == null) {
                await trx.rollback();
                return response.status(404).json({ code: 404, status: 'Publisher ' + payload.publisher_id + ' Not Found', data: null });
            }

            await Database
                .from(Book.table)
                .useTransaction(trx)
                .update({ publisher_id: payload.publisher_id, title: payload.title, description: payload.description })
                .where('book_id', bookId);

            await Database.from(BookAuthor.table).where('book_id', bookId).delete();

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

            return response.status(200).json({ code: 200, status: 'success', data: books });
        } catch (err) {
            await trx.rollback();
            return response.status(500).json({ code: 500, status: 'error', message: err.messages });
        }
    }

    public async delete({ params, response }: HttpContextContract) {
        const trx = await Database.transaction()
        try {
            const books = await Book.findBy('book_id', params.id);
            if (books == null) {
                await trx.rollback();
                return response.status(404).json({ code: 404, status: 'Data Not Found', data: null });
            }

            await Database.from(BookAuthor.table).where('book_id', params.id).delete();
            await Database.from(Book.table).where('book_id', params.id).delete();

            await trx.commit();

            return response.status(200).json({ code: 200, status: 'success', data: books });
        } catch (err) {
            await trx.rollback();
            return response.status(500).json({ code: 500, status: 'error', message: err.message });
        }
    }
}
