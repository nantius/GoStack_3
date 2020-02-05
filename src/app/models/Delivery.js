import { Model, Sequelize } from 'sequelize';

class Delivery extends Model {
  static init(sequelize) {
    super.init(
      {
        product: Sequelize.STRING,
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        cancelled_at: Sequelize.DATE
      },
      {
        sequelize
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.DeliveryPerson, {
      foreignKey: 'delivery_person_id',
      as: 'delivery_person'
    });
    this.belongsTo(models.Recipient, {
      foreignKey: 'recipient_id',
      as: 'recipient'
    });
    this.belongsTo(models.File, {
      foreignKey: 'signature_id',
      as: 'signature'
    });
    this.hasMany(models.DeliveryProblem, {
      as: 'delivery_problem'
    });
  }
}

export default Delivery;
