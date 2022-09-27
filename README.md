# adonis-js-rest-api

This repository contains a simple CRUD REST API using Adonis JS 5

## Tech Stack

**Auth :** Basic Auth (Username and Password in the user table)
**Developed on :** Adonis 5, Node 16.16.0, Npm 8.11.0, Mac OS Monterey 12.4 (Apple Silicon)

To install the this project, you can follow these steps:

## Support File

This file needs to be prepared before installing

[Postman Collection](https://github.com/fajarfaruq/adonis-js-rest-api/blob/main/Adonis%20JS%20Rest%20API.postman_collection.json)

[MySQL Database](https://github.com/fajarfaruq/adonis-js-rest-api/blob/main/book_collections.sql)

## Installation

```bash

cp .env.example .env  --> (.env can modify as needed. ex. database setting)

node ace db:seed -i --> (Select in order 1. Author, 2. Publisher, 3. Book, 4. User)

npm install && npm run dev

```