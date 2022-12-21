'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    options.tableName = 'Bookings';
   return queryInterface.bulkInsert(options, [
    {
      spotId: 1,
      userId: 1,
      startDate: '2023-01-10',
      endDate: '2023-01-15'
    },
    {
      spotId: 2,
      userId: 1,
      startDate: '2023-02-10',
      endDate: '2023-02-15'
    },
    {
      spotId: 3,
      userId: 2,
      startDate: '2023-03-22',
      endDate: '2023-03-29'
    },
    {
      spotId: 4,
      userId: 2,
      startDate: '2023-09-26',
      endDate: '2023-09-30'
    },
    {
      spotId: 5,
      userId: 3,
      startDate: '2023-07-16',
      endDate: '2023-08-01'
    },
   ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete(options, {}, {});
  }
};
