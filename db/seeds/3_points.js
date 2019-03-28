
exports.seed = function(knex, Promise) {
  return knex('points').del()
    .then(function () {
      return Promise.all([
        knex('points').insert({map_id: knex('maps').where('title','Coffee').select('id'), title:'Cafe', date_created: '2019-03-27', description: 'Where coffee zombies live', image: 'I AM AN IMAGE'}),
        knex('points').insert({map_id: knex('maps').where('title','Sightseeing').select('id'), title:'Stanley Park', date_created: '2019-03-26', description: 'The greatest park in the world', image: 'I AM AN IMAGE'}),
        
      ]);
    });
};
