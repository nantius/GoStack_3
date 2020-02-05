import { startOfDay, addHours, isWithinInterval } from 'date-fns';
import { Op } from 'sequelize';
import * as Yup from 'yup';
import DeliveryPerson from '../models/DeliveryPerson';
import Delivery from '../models/Delivery';

class DeliveryStartController {
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

    // Checking if between 08:00 and 18:00
    const open = addHours(startOfDay(new Date()), 9); // 9
    const close = addHours(startOfDay(new Date()), 19); // 19
    const isAvailable = isWithinInterval(new Date(), {
      start: open,
      end: close
    });

    if (!isAvailable) {
      return res
        .status(400)
        .json({ error: 'Deliveries are from 08:00 am to 18:00 pm.' });
    }

    // Checking if the delivery person already made 5 deliveries today
    const delivery_count = await Delivery.count({
      where: {
        start_date: { [Op.between]: [open, new Date()] },
        delivery_person_id: req.body.delivery_person_id
      }
    });

    if (delivery_count >= 5) {
      return res
        .status(400)
        .json({ error: 'Delivery people can only make 5 deliveries per day' });
    }

    delivery.start_date = new Date();
    await delivery.save();
    return res.json({ delivery, delivery_count });
  }
}

export default new DeliveryStartController();
