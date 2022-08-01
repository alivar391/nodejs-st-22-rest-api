'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          id: '8a1dc202-8ca3-4dc2-9348-3932f17e9433',
          login: 'John Doe',
          password: 'password1',
          age: 21,
          isDeleted: false,
        },
        {
          id: 'ad4895b7-ecaa-4070-980a-b0b843851b4d',
          login: 'Albert Einstein',
          password: 'pass2',
          age: 50,
          isDeleted: false,
        },
        {
          id: 'cea4fce6-da92-42ce-975d-7aaea62147ff',
          login: 'Isaac Newton',
          password: 'password3',
          age: 47,
          isDeleted: false,
        },
        {
          id: 'd1ab2394-8e77-4363-bad3-11d0de3a1d8d',
          login: 'Galileo Galilei',
          password: 'pass2',
          age: 52,
          isDeleted: false,
        },
        {
          id: '1a7f8635-ab29-4e1f-98bf-957f5fd615d6',
          login: 'Charles Darwin',
          password: 'password3',
          age: 47,
          isDeleted: false,
        },
      ],
      {},
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
