import * as Yup from 'yup';
import Delivery from '../models/Delivery';
import DeliveryPerson from '../models/DeliveryPerson';

class DeliveryEndController {
  async update(req, res) {
    const schema = Yup.object().shape({
      delivery_person_id: Yup.number().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const delivery_person = await DeliveryPerson.findByPk(
      req.body.delivery_person_id
    );

    if (!delivery_person) {
      return res.json({ error: 'Delivery person not found' });
    }

    const delivery = await Delivery.findByPk(req.params.id);

    if (!delivery) {
      return res.json({ error: 'Delivery not found' });
    }

    delivery.end_date = new Date();
    delivery.signature_id = req.body.signature_id;
    await delivery.save();
    return res.json(delivery);
  }
}

export default new DeliveryEndController();
