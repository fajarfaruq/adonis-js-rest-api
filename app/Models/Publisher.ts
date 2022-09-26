import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Publisher extends BaseModel {
  public static table = 'publishers'
  
  @column({columnName: 'publisher_id', isPrimary: true })
  public publisherId: number

  @column({columnName: 'name'})
  public name: string

  @column({columnName: 'description'})
  public description: string

}
