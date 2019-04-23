# mapbook
Midterm project for Lighthouse Labs Web Development Bootcamp
Main Contributors: [Hao Jiang](https://github.com/Polatouche0201), [Estella Song](https://github.com/estellajaysong), [Bonita Choi](https://github.com/bonitac)

## Overview
For our Midterm Project, we created an app called mapbook that allows users to create a map with markers by inputing an address or location name to create a marker. The location's name, description, photo may be editted as desired. Users can add or remove locations to their own maps. Anyone may view all maps that have been created, but may only "like" a map once logged in. One may not like their own map.

## Screenshots of the Final Product
All users may view maps, but one may not create a map if not logged in.

![Trying to Create Map Without Logging In](https://github.com/bonitac/mapbook/blob/master/docs/create_map_not_logged_in.png)

Screenshot of "Favourite Maps"
![Screenshot of "Favourite Maps"]()

Screenshot of "Contributed Maps"
![Screenshot of "Contributed Maps"]()

A user may not like a map that they have created.
![Gif of Liking Maps](https://github.com/bonitac/mapbook/blob/master/docs/2019-04-23%2014.39.00.gif)

A screenshot of a map with many points with a specific point clicked
![Screenshot of map with many points with a specific point clicked]()

Gif of Creating a map once logged in
![Gif of Creating a map once logged in]()

Gif of editting a point
![Gif of editting a point]()

Gif of removing a point
![Gif of removing a point]()


## Getting Started
1. Fork this repository.
2. Install dependencies using `npm install` command.
3. Run migrations: `npm run knex migrate:latest`
  - Check the migrations folder to see what gets created in the DB
4. Run the seed: `npm run knex seed:run`
  - Check the seeds file to see what gets seeded in the DB
5. Run the server: `npm run local`
6. Visit `http://localhost:8080/maps`

## App usage
- Currently, this app has 3 users in the database, without the ability to register a new user
- Once Logged in as a visitor, you may create and like maps as you wish!

## Dependencies

- Node 5.10.x or above
- NPM 3.8.x or above
- Body-parser
- Dotenv
- EJS
- JQuery
- Knex
- Knex-Logger
- PostgreSQL
- Sass
- Morgan
