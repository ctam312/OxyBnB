'use strict';

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
   return queryInterface.bulkInsert(options, [
    {
      ownerId: 1,
      address: '123 W. Albany Drive',
      city: 'Chicago',
      state: 'Illinois',
      country: 'America',
      lat: -14.1251512,
      lng: 123.12414,
      name: 'Red House',
      description: 'Come live in the red house!',
      price: 124.15
    },
    {
      ownerId:1,
      address:'984 N. Poop Lane',
      city: 'Jahova',
      state: 'Alabama',
      country: "America",
      lat: 122.140412,
      lng: -123.2498,
      name: 'Blue House',
      description: 'Come live in the blue house!',
      price: 85.23
    },
    {
      ownerId:2,
      address:'48 N. Allston Lane',
      city: 'Apricot',
      state: 'Ligma',
      country: "America",
      lat: 104.140412,
      lng: -93.2498,
      name: 'Green House',
      description: 'Come live in the green house!',
      price: 85.23
    },
    {
      ownerId:3,
      address:'88 Lucky Lane',
      city: 'Biggum',
      state: 'Texas',
      country: "America",
      lat: 77.777,
      lng: -88.320,
      name: 'Pink House',
      description: 'Come live in the pink house!',
      price: 99.22
    },
    {
      ownerId:3,
      address:'412 W. Tracker',
      city: 'Pheonix',
      state: 'Arizona',
      country: "America",
      lat: 72.1243,
      lng: -92.2498,
      name: 'Blue House',
      description: 'Come live in the blue house!',
      price: 201.45
    },
    ],{});
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
