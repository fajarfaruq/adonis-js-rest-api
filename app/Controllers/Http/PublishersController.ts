import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Publisher from 'App/Models/Publisher';

/**
 * This class using for manage publishers
 */
export default class PublishersController {
    /**
     * @param  {HttpContextContract} {response}
     */
    public async getAll({ response }: HttpContextContract) {
        const publishers = await Publisher.all();

        return response
            .status(200)
            .json({ code: 200, status: "success", data: publishers });
    }
    /**
     * Function getById using for get data publisher by Id
     * 
     * @param  {} {params
     * @param  {HttpContextContract} response}
     */
    public async getById({ params, response }: HttpContextContract) {
        try {
            const publishers = await Publisher.query().where('publisher_id', '=', params.id).first();
            if (publishers == null) {
                return response.status(404).json({ code: 404, status: 'Data Not Found', data: null });
            }
            return response.status(200).json({ code: 200, status: 'success', data: publishers });
        } catch (err) {
            return response.status(500).json({ code: 500, status: 'error', message: err.messages });
        }
    }
    /**
     * Function getByName using for get data publishers by name
     * 
     * @param  {} {params Containts param name as publisher_name
     * @param  {HttpContextContract} response}
     */
    public async getByName({ params, response }: HttpContextContract) {
        try {
            const publishers = await Publisher.query().where('name', 'LIKE', '%' + params.name + '%');
            if (publishers == null) {
                return response.status(404).json({ code: 404, status: 'Data Not Found', data: null });
            }
            return response.status(200).json({ code: 200, status: 'success', data: publishers });
        } catch (err) {
            return response.status(500).json({ code: 500, status: 'error', message: err.messages });
        }
    }
    /**
     * Function create using for insert new record to publisher
     * 
     * @param  {} {request Containts JSON payload which sent from API
     * @param  {HttpContextContract} response}
     */
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

            const publishers = await Publisher.create(payload);

            return response.status(200).json({ code: 200, status: 'success', data: publishers });

        } catch (err) {
            return response.status(500).json({ code: 500, status: 'error', message: err.messages });
        }
    }
    /**
     * Function update using for update publishers by id
     * 
     * @param  {} {params  Containts param id as publisher_id
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

            const publishers = await Publisher.findBy('publisher_id', params.id);
            if (publishers == null) {
                return response.status(404).json({ code: 404, status: 'Data Not Found', data: null });
            }
            publishers?.merge(payload);

            await publishers?.save()

            return response.status(200).json({ code: 200, status: 'success', data: publishers })
        } catch (err) {
            return response.status(500).json({ code: 500, status: 'error', message: err.messages })
        }
    }
    /**
     * Function delete using for delete publishers by publisher_id
     * 
     * @param  {} {params Containts param id as publisher_id
     * @param  {HttpContextContract} response}
     */
    public async delete({ params, response }: HttpContextContract) {
        try {
            const publishers = await Publisher.findBy('publisher_id', params.id);
            if (publishers == null) {
                return response.status(404).json({ code: 404, status: 'Data Not Found', data: null });
            }
            await publishers?.delete();

            return response.status(200).json({ code: 200, status: 'success', data: publishers });
        } catch (err) {
            return response.status(500).json({ code: 500, status: 'error', message: err.message });
        }
    }
}
