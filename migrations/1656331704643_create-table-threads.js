/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable('threads', {
    id: {
      type: 'VARCHAR(32)',
      primaryKey: true,
    },
    title: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    body: {
      type: 'TEXT',
      notNull: true,
    },
    created_at: {
      type: 'TEXT',
      notNull: true,
    },
    updated_at: {
      type: 'TEXT',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(32)',
      references: '"users"',
      onDelete: 'CASCADE',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('threads');
};
