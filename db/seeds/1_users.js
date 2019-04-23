exports.seed = function(knex, Promise) {
  return knex('users').del()
    .then(function () {
      return Promise.all([
        knex('users').insert({name: 'Bonita', password:'12345', avatar: 'avatar1.png'}),
        knex('users').insert({name: 'Estella', password:'12345', avatar: 'avatar2.png'}),
        knex('users').insert({name: 'Howard', password:'12345', avatar: 'avatar3.png'}),
      ]);
    });
};
