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
      stars: 2
    },
    {
      spotId: 3,
      userId: 3,
      review: 'This place actually sucks',
      stars: 3
    },
    {
      spotId: 4,
      userId: 1,
      review: 'Eh the place is alright',
      stars: 4
    },
    {
      spotId: 5,
      userId: 2,
      review: 'Pretty nice, but loud neighbors',
      stars: 5
    },
    {
      spotId: 1,
      userId: 2,
      review: 'This place not it',
      stars: 2
    },
    {
      spotId: 2,
      userId: 2,
      review: 'average place',
      stars: 3
    },
    {
      spotId: 3,
      userId: 2,
      review: 'really nice, love the design',
      stars: 4
    },
    {
      spotId: 4,
      userId: 2,
      review: 'this place is perfect',
      stars: 5
    },
    {
      spotId: 5,
      userId: 2,
      review: 'eh its alright',
      stars: 2
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
