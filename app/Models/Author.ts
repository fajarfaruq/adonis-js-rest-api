import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Author extends BaseModel {
  public static table = 'authors'
  
  @column({columnName: 'author_id', isPrimary: true })
  public authorId: number

  @column({columnName: 'name'})
  public name: string

  @column({columnName: 'description'})
  public description: string
}
