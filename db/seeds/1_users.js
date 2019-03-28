exports.seed = function(knex, Promise) {
  return knex('users').del()
    .then(function () {
      return Promise.all([
        knex('users').insert({name: 'Bonita', password:'password', avatar: ''}),
        knex('users').insert({name: 'Estella', password:'password', avatar: ''}),
        knex('users').insert({name: 'Howard', password:'password', avatar: ''}),
        
      ]);
    });
};
