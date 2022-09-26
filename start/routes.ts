/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
});

Route.group(() => {
  
  Route.group(() => {
    Route.get('all', 'PublishersController.getAll');
    Route.get('by-id/:id', 'PublishersController.getById');
    Route.get('by-name/:name', 'PublishersController.getByName');
    Route.post('create', 'PublishersController.create');
    Route.put('update/:id', 'PublishersController.update'); 
    Route.delete('delete/:id', 'PublishersController.delete');
  }).prefix('publisher');

  Route.group(() => {
    Route.get('all', 'AuthorsController.getAll');
    Route.get('by-id/:id', 'AuthorsController.getById');
    Route.get('by-name/:name', 'AuthorsController.getByName');
    Route.post('create', 'AuthorsController.create');
    Route.put('update/:id', 'AuthorsController.update'); 
    Route.delete('delete/:id', 'AuthorsController.delete');
  }).prefix('author');

  Route.group(() => {
    Route.get('all', 'BooksController.getAll');
    Route.get('by-id/:id', 'BooksController.getById');
    Route.get('by-name/:name', 'BooksController.getByName');
    Route.post('create', 'BooksController.create');
    Route.put('update/:id', 'BooksController.update'); 
    Route.delete('delete/:id', 'BooksController.delete');
  }).prefix('book');

}).prefix('api');
