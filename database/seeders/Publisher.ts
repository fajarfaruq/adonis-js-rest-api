import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Publisher from 'App/Models/Publisher'

export default class extends BaseSeeder {
  public async run () {
    let publisher = await Publisher.findBy('publisher_id', 1);
    await publisher?.delete();

    publisher = await Publisher.findBy('publisher_id', 2);
    await publisher?.delete();

    await Publisher.createMany([
      {
        publisherId: 1,
        name: 'Erlangga',
        description: 'The name of publisher is Erlangga',
      },
      {
        publisherId: 2,
        name: 'Tiga Serangkai',
        description: 'The name of publisher is Tiga Serangkai',
      }
    ])
  }
}
