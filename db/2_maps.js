
exports.seed = function(knex, Promise) {
  return knex('maps').del()
    .then(function () {
      return Promise.all([
        knex('maps').insert({title: 'Coffee', icon:'/icon/Map01.png', description: 'I NEED COFFEE !', user_id: 1, date_created: '2019-03-26'}),
        // knex('maps').insert({title: 'Sightseeing', icon:'heart', description: 'Discover Vancouver', user_id: knex('users').where('name','Bonita').select('id'), date_created: '2019-03-26'}),
      ]);
    });
};
