exports.up = function (knex) {
  return knex.schema.createTable("mahasiswa", (table) => {
    table.uuid("id").primary();
    table.string("nim").notNullable();
    table.string("nama").notNullable();
    table.string("jurusan").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("mahasiswa");
};
