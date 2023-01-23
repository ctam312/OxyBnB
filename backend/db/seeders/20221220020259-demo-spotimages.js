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
  options.tableName = 'SpotImages';
   return queryInterface.bulkInsert(options, [
    {
      spotId: 1,
      url: 'https://cdn.houseplansservices.com/content/e8f9m1vq6pnjhtd5h1u0tj16cc/w575.jpg?v=9',
      preview: true,
    },
    {
      spotId: 2,
      url: 'http://olympicca81prd.blob.core.windows.net/cmsstorage/olympic/files/b9/b90784de-16b1-40d2-82ba-da4625d416a3.jpg',
      preview: true,
    },
    {
      spotId: 3,
      url: 'https://lovehomedesigns.com/wp-content/uploads/2022/09/cool-house-091222-1.jpg.webp',
      preview: true,
    },
    {
      spotId: 4,
      url: 'https://images.ctfassets.net/f60q1anpxzid/asset-153e21e5d95cdb924e54d64c2845add9/2f896bbdd94d450fefede8de0f782386/pink-house.jpeg?fm=jpg&fl=progressive&q=50&w=1200',
      preview: true,
    },
    {
      spotId: 5,
      url: 'https://cdn.homedit.com/wp-content/uploads/2016/06/Cool-blue-villa-from-123-dva-transparent-swimming-pool.jpg',
      preview: true,
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
    options.tableName = 'SpotImages';
    return queryInterface.bulkDelete(options, {}, {});
  }
};
