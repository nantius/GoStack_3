import { Model, Sequelize } from 'sequelize';

class DeliveryPerson extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        deleted_at: Sequelize.DATE
      },
      {
        sequelize
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
  }
}

export default DeliveryPerson;
