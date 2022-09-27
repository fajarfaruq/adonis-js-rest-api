import { test } from '@japa/runner'

test.group('Authors', () => {
  // This test using for test basic auth
  test('get all authors', async ({ client }) => {
    const response = await client.get('/api/author/all').basicAuth('admin@gmail.com', 'admina')
    console.log(response.body())
    response.assertStatus(401)
  })

  // This test using for test get all authors
  test('get all authors', async ({ client }) => {
    const response = await client.get('/api/author/all').basicAuth('admin@gmail.com', 'admin')
    console.log(response.body())
    response.assertStatus(200)
  })

  // This test using for test get all authors by id
  test('get authors by Id', async ({ client }) => {
    const response = await client.get('/api/author/by-id/1').basicAuth('admin@gmail.com', 'admin')
    console.log(response.body())
    response.assertStatus(200)
  })

  // This test using for test get all authors by name
  test('get authors by name', async ({ client }) => {
    const response = await client.get('/api/author/by-name/luk').basicAuth('admin@gmail.com', 'admin')
    console.log(response.body())
    response.assertStatus(200)
  })
})
