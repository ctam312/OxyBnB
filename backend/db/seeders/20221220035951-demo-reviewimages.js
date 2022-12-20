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
      reviewId: 1,
      url: 'https://static7.depositphotos.com/1252160/758/i/950/depositphotos_7588755-stock-photo-ugly-house.jpg'
    },
    {
      reviewId: 2,
      url: 'https://as1.ftcdn.net/v2/jpg/02/30/34/40/1000_F_230344041_JUOgunoFY99d6eso1kLjsarIgdJ0h7tr.jpg'
    },
    {
      reviewId: 3,
      url: 'https://st.depositphotos.com/1041088/4710/i/950/depositphotos_47103179-stock-photo-old-ugly-house.jpg'
    },
    {
      reviewId: 4,
      url: 'https://www.houselogic.com/wp-content/uploads/2012/02/ugly-houses-boulder_3eaa770dd6318ceb8acd99284c8ef366-1.jpg?crop&resize=960%2C540'
    },
    {
      reviewId: 5,
      url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxJeoLYwZTXjhcYaCKgZsd_AO4vhvDDAGWuw&usqp=CAU'
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
