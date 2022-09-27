import { test } from '@japa/runner'

test.group('Books', () => {
  // This test using for test get all books
  test('get all books', async ({ client }) => {
    const response = await client.get('/api/book/all').basicAuth('admin@gmail.com', 'admin')
    console.log(response.body())
    response.assertStatus(200)
  })

  // This test using for test get books by id
  test('get book by Id', async ({ client }) => {
    const response = await client.get('/api/book/by-id/1').basicAuth('admin@gmail.com', 'admin')
    console.log(response.body())
    response.assertStatus(200)
  })

  // This test using for test get all books by name
  test('get books by name', async ({ client }) => {
    const response = await client.get('/api/book/by-name/pem').basicAuth('admin@gmail.com', 'admin')
    console.log(response.body())
    response.assertStatus(200)
  })
})
