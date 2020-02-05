import { Model, Sequelize } from 'sequelize';

class Recipient extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        address: Sequelize.STRING,
        extra_info: Sequelize.STRING,
        state: Sequelize.STRING,
        city: Sequelize.STRING,
        zip: Sequelize.STRING
      },
      {
        sequelize
      }
    );

    return this;
  }
}

export default Recipient;
