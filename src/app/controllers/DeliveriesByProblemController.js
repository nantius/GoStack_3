import { Op } from 'sequelize';
import Delivery from '../models/Delivery';
import DeliveryProblem from '../models/DeliveryProblem';
import DeliveryPerson from '../models/DeliveryPerson';
import Queue from '../../lib/Queue';
import CancellationMail from '../jobs/CancellationMail';

class DeliveriesByProblemController {
  async index(req, res) {
    const deliveries = await Delivery.findAll({
      where: {
        '$delivery_problem.delivery_id$': {
          [Op.ne]: null
        }
      },
      include: [
        {
          model: DeliveryProblem,
          as: 'delivery_problem',
          attributes: []
        }
      ]
    });

    return res.json(deliveries);
  }

  async delete(req, res) {
    const delivery_problem = await DeliveryProblem.findByPk(req.params.id);
    if (!delivery_problem) {
      return res.status(400).json({ error: 'Delivery Problem not found' });
    }

    if (!delivery_problem.delivery_id) {
      return res.json({ error: 'Delivery not found' });
    }

    const delivery = await Delivery.findByPk(delivery_problem.delivery_id);
    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found' });
    }

    delivery.cancelled_at = new Date();
    await delivery.save();

    const delivery_person = await DeliveryPerson.findByPk(
      delivery.delivery_person_id
    );

    if (!delivery_person) {
      return res.status(400).json({ error: 'Delivery person not found' });
    }

    await Queue.add(CancellationMail.key, {
      problem: delivery_problem.description,
      product: delivery.product,
      delivery_person
    });

    return res.json(delivery);
  }
}

export default new DeliveriesByProblemController();
