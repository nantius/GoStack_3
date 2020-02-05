import Delivery from '../models/Delivery';
import DeliveryPerson from '../models/DeliveryPerson';

class AssignedDeliveryController {
  async index(req, res) {
    const delivery_person = await DeliveryPerson.findByPk(req.params.id);

    if (!delivery_person) {
      res.status(400).json({ error: "Delivery Person doesn't exist." });
    }

    const deliveries = await Delivery.findAll({
      where: {
        delivery_person_id: req.params.id,
        end_date: null,
        cancelled_at: null
      }
    });

    return res.json(deliveries);
  }
}

export default new AssignedDeliveryController();
