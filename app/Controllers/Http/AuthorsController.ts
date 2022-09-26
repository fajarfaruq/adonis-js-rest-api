import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Author from 'App/Models/Author';

export default class AuthorsController {
    public async getAll({ response }: HttpContextContract) {
        const authors = await Author.all();

        return response
            .status(200)
            .json({ code: 200, status: "success", data: authors });
    }

    public async getById({ params, response }: HttpContextContract) {
        try {
            const authors = await Author.query().where('id', '=', params.id).first();
            if (authors == null) {
                return response.status(404).json({ code: 404, status: 'Data Not Found', data: null });
            }
            return response.status(200).json({ code: 200, status: 'success', data: authors });
        } catch (err) {
            return response.status(500).json({ code: 500, status: 'error', message: err.messages });
        }
    }

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

    public async create({ request, response }: HttpContextContract) {
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

            const authors = await Author.create(payload);

            return response.status(200).json({ code: 200, status: 'success', data: authors });

        } catch (err) {
            return response.status(500).json({ code: 500, status: 'error', message: err.messages });
        }
    }

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

            const authors = await Author.findBy('id', params.id);
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

    public async delete({ params, response }: HttpContextContract) {
        try {
            const authors = await Author.findBy('id', params.id);
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
