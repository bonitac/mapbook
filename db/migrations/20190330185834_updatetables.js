
exports.up = function(knex, Promise) {
  return knex.schema.table('points', function (row){
    row.string('lat');
    row.string('lng');
    row.string('image',511).alter();
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('points', function(row){
    row.dropColumn('lat');
    row.dropColumn('lng')
    row.dropColumn('image')
  })
};