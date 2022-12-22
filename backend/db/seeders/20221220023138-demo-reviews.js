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
    options.tableName = 'Reviews';
   return queryInterface.bulkInsert(options, [
    {
      spotId: 1,
      userId: 1,
      review: 'This place actually sucks',
      stars: 1
    },
    {
      spotId: 2,
      userId: 2,
      review: 'Totally come back here',
      stars: 5
    },
    {
      spotId: 5,
      userId: 3,
      review: 'This place actually sucks',
      stars: 2
    },
    {
      spotId: 4,
      userId: 1,
      review: 'Eh the place is alright',
      stars: 3
    },
    {
      spotId: 5,
      userId: 2,
      review: 'Pretty nice, but loud neighbors',
      stars: 4
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
    options.tableName = 'Reviews';
    return queryInterface.bulkDelete(options, {}, {});
  }
};
