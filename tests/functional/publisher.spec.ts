import { test } from '@japa/runner'

test.group('Publishers', () => {
  // This test using for test get all publisher
  test('get all publisher', async ({ client }) => {
    const response = await client.get('/api/publisher/all').basicAuth('admin@gmail.com', 'admin')
    console.log(response.body())
    response.assertStatus(200)
  })

  // This test using for test get all publisher by id
  test('get publisher by Id', async ({ client }) => {
    const response = await client.get('/api/publisher/by-id/1').basicAuth('admin@gmail.com', 'admin')
    console.log(response.body())
    response.assertStatus(200)
  })

  // This test using for test get all publisher by name
  test('get publisher by name', async ({ client }) => {
    const response = await client.get('/api/publisher/by-name/erl').basicAuth('admin@gmail.com', 'admin')
    console.log(response.body())
    response.assertStatus(200)
  })
})
