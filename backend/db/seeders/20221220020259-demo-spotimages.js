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
      url: 'https://coolmaterial.com/wp-content/uploads/2019/12/Niko-Architecture-House-in-the-Landscape-1000x600.jpg',
      preview: false,
    },
    {
      spotId: 3,
      url: 'https://lovehomedesigns.com/wp-content/uploads/2022/09/cool-house-091222-1.jpg.webp',
      preview: true,
    },
    {
      spotId: 4,
      url: 'https://i.pinimg.com/736x/80/08/86/800886c220426a3eaf88d94446fc748e--mojave-solar-panels.jpg',
      preview: false,
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
