exports.seed = function(knex, Promise) {
  return knex('users').del()
    .then(function () {
      return Promise.all([
        knex('users').insert({id: 1, name: 'Bonita'}),
        knex('users').insert({id: 2, name: 'Estella'}),
        knex('users').insert({id: 3, name: 'Howard'})
      ]);
    });
};
