
exports.seed = function(knex, Promise) {
  return knex('user_favourite').del()
    .then(function () {
      return Promise.all([
        knex('user_favourite').insert({map_id: knex('maps').where('title','Coffee').select('id'), user_id: knex('users').where('name','Howard').select('id'), date: '2019-03-27'}),
        knex('user_favourite').insert({map_id: knex('maps').where('title','Sightseeing').select('id'), user_id: knex('users').where('name','Estella').select('id'), date: '2019-03-27'})
      ]);
    });
};
