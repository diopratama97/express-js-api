exports.up = function (knex) {
  return knex.schema.createTable("users", (table) => {
    table.uuid("id").primary();
    table.string("username").notNullable();
    table.string("email").notNullable();
    table.text("password").notNullable();
    table.integer("role").notNullable();
    table.text("photo");
    table.timestamp("tanggal_daftar").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("users");
};
