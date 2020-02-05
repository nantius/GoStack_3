import { Op } from 'sequelize';
import Delivery from '../models/Delivery';
import DeliveryPerson from '../models/DeliveryPerson';

class DeliveredController {
  async index(req, res) {
    const delivery_person = await DeliveryPerson.findByPk(req.params.id);

    if (!delivery_person) {
      res.status(400).json({ error: "Delivery Person doesn't exist." });
    }

    const deliveries = await Delivery.findAll({
      where: { delivery_person_id: req.params.id, end_date: { [Op.ne]: null } }
    });

    return res.json(deliveries);
  }
}

export default new DeliveredController();
