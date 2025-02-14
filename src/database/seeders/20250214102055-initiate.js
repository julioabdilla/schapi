'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    // Insert into `roles` table
    await queryInterface.bulkInsert('roles', [
      { id: 1, name: 'superuser' },
      { id: 2, name: 'admin' },
      { id: 3, name: 'staff' },
    ]);

    // Insert into `permissions` table
    await queryInterface.bulkInsert('permissions', [
      { id: 1, name: 'user.read' },
      { id: 2, name: 'user.create' },
      { id: 3, name: 'user.update' },
      { id: 4, name: 'user.delete' },
      { id: 5, name: 'staff.read' },
      { id: 6, name: 'staff.create' },
      { id: 7, name: 'staff.update' },
      { id: 8, name: 'staff.delete' },
      { id: 9, name: 'gallery.read' },
      { id: 10, name: 'gallery.create' },
      { id: 11, name: 'gallery.update' },
      { id: 12, name: 'gallery.delete' },
      { id: 13, name: 'article.read' },
      { id: 14, name: 'article.create' },
      { id: 15, name: 'article.update' },
      { id: 16, name: 'article.delete' },
      { id: 17, name: 'me.read' },
      { id: 18, name: 'me.update' },
      { id: 19, name: 'me.delete' },
    ]);

    // Insert into `users` table
    await queryInterface.bulkInsert('users', [
      {
        id: 1,
        uuid: '6d2e44f0-551d-4886-954f-942a6c23754e',
        role_id: 1,
        name: 'admin',
        username: 'julio.abdilla@gmail.com',
        password: '6b2860a6da44b826d9cae5f351c4ada7',
        created_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        updated_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        deleted_at: null,
      },
    ]);
  },

  down: async (queryInterface) => {
    // Delete all seeded data
    await queryInterface.bulkDelete('users', { id: 1 });
    await queryInterface.bulkDelete('permissions', { id: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19] });
    await queryInterface.bulkDelete('roles', { id: [1, 2, 3] });
  },
};