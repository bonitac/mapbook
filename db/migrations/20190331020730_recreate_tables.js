exports.up = function (knex, Promise) {
  return userTable()
    .then(mapTable)
    .then(userFavourite)
    .then(pointsTable);

  function userTable() {
    return knex.schema.createTable('users', function (table) {
      table.increments('id').primary();
      table.string('name');
      table.string('password');
      table.string('avatar');
    });
  };

  function mapTable() {
    return knex.schema.createTable('maps', function (table) {
      table.increments('id').primary();
      table.string('title');
      table.string('icon');
      table.string('description');
      table.integer('user_id');
      table.foreign('user_id').references('id').inTable('users');
      table.date('date_created');
    });
  };

  function userFavourite() {
    return knex.schema.createTable('user_favourite', function (table) {
      table.integer('user_id');
      table.foreign('user_id').references('id').inTable('users');
      table.integer('map_id');
      table.foreign('map_id').references('id').inTable('maps');
      table.date('date');
    });
  };

  function pointsTable() {
    return knex.schema.createTable('points', function (table) {
      table.increments('id').primary();
      table.integer('map_id');
      table.foreign('map_id').references('id').inTable('maps');
      table.string('title');
      table.date('date_created');
      table.string('description');
      table.string('lat');
      table.string('lng');
      table.string('image',511);
    });
  };
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('points')
    .then(knex.schema.dropTable('user_favourite'))
    .then(knex.schema.dropTable('maps'))
    .then(knex.schema.dropTable('users'))
};