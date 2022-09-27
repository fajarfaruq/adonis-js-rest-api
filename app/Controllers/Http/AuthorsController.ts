import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Author from 'App/Models/Author';

/**
 * This class using for manage authors 
 */
export default class AuthorsController {
    /**
     * Function getAll using for show all authors
     * 
     * @param  {HttpContextContract} {response}
     */
    public async getAll({ response }: HttpContextContract) {
        const authors = await Author.all();

        return response
            .status(200)
            .json({ code: 200, status: "success", data: authors });
    }

    /**
     * Function getById using for get data authors by Id
     * 
     * @param  {} {params   Containts param id as author_id
     * @param  {HttpContextContract} response}
     */
    public async getById({ params, response }: HttpContextContract) {
        try {
            const authors = await Author.query().where('author_id', '=', params.id).first();
            if (authors == null) {
                return response.status(404).json({ code: 404, status: 'Data Not Found', data: null });
            }
            return response.status(200).json({ code: 200, status: 'success', data: authors });
        } catch (err) {
            return response.status(500).json({ code: 500, status: 'error', message: err.messages });
        }
    }
    /**
     * Function getByName using for get data authors by name
     * 
     * @param  {} {params Containts param name as author_name
     * @param  {HttpContextContract} response}
     */
    public async getByName({ params, response }: HttpContextContract) {
        try {
            const authors = await Author.query().where('name', 'LIKE', '%' + params.name + '%');
            if (authors == null) {
                return response.status(404).json({ code: 404, status: 'Data Not Found', data: null });
            }
            return response.status(200).json({ code: 200, status: 'success', data: authors });
        } catch (err) {
            return response.status(500).json({ code: 500, status: 'error', message: err.messages });
        }
    }
    /**
     * Function create using for insert new record to authors
     * 
     * @param  {} {request Containts JSON payload which sent from API
     * @param  {HttpContextContract} response}
     */
    public async create({ request, response }: HttpContextContract) {
        try {
            // Define schema for validator payload
            const newPostSchema = schema.create({
                name: schema.string({ trim: true }, [rules.minLength(3), rules.maxLength(50)]),
                description: schema.string()
            });

            // Define schema for validate payload
            const messages = {
                minLength: '{{ field }} must be at least {{ options.minLength }} characters long',
                maxLength: '{{ field }} cannot be longer than {{ options.maxLength }} characters long'
            };
            // Run validate depending on schema
            const payload = await request.validate({ schema: newPostSchema, messages });

            const authors = await Author.create(payload);

            return response.status(200).json({ code: 200, status: 'success', data: authors });

        } catch (err) {
            return response.status(500).json({ code: 500, status: 'error', message: err.messages });
        }
    }
    /**
     * Function update using for update authors by id
     * 
     * @param  {} {params  Containts param id as author_id
     * @param  {} request Containts JSON payload which sent from API
     * @param  {HttpContextContract} response}
     */
    public async update({ params, request, response }: HttpContextContract) {
        try {
            const newPostSchema = schema.create({
                name: schema.string({ trim: true }, [rules.minLength(3), rules.maxLength(50)]),
                description: schema.string()
            });

            const messages = {
                minLength: '{{ field }} must be at least {{ options.minLength }} characters long',
                maxLength: '{{ field }} cannot be longer than {{ options.maxLength }} characters long'
            };

            const payload = await request.validate({ schema: newPostSchema, messages });

            const authors = await Author.findBy('author_id', params.id);
            if (authors == null) {
                return response.status(404).json({ code: 404, status: 'Data Not Found', data: null });
            }
            authors?.merge(payload);

            await authors?.save()

            return response.status(200).json({ code: 200, status: 'success', data: authors })
        } catch (err) {
            return response.status(500).json({ code: 500, status: 'error', message: err.messages })
        }
    }
    /**
     * Function delete using for delete authors by author_id
     * 
     * @param  {} {params Containts param id as author_id
     * @param  {HttpContextContract} response}
     */
    public async delete({ params, response }: HttpContextContract) {
        try {
            const authors = await Author.findBy('author_id', params.id);
            if (authors == null) {
                return response.status(404).json({ code: 404, status: 'Data Not Found', data: null });
            }
            await authors?.delete();

            return response.status(200).json({ code: 200, status: 'success', data: authors });
        } catch (err) {
            return response.status(500).json({ code: 500, status: 'error', message: err.message });
        }
    }
}
