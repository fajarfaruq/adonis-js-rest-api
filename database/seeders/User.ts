import Database from '@ioc:Adonis/Lucid/Database'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import authConfig from 'Config/auth'

export default class extends BaseSeeder {
  public async run() {
    await Database
      .table(authConfig.guards.basic.provider.usersTable)
      .multiInsert([
        {
          email: 'admin@gmail.com',
          password: 'admin',
        },
        {
          email: 'admin1@gmail.com',
          password: 'admin1'
        }
      ])
  }
}
