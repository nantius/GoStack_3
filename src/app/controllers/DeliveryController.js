import * as Yup from 'yup';
import Delivery from '../models/Delivery';
import DeliveryPerson from '../models/DeliveryPerson';
import Recipient from '../models/Recipient';
import Queue from '../../lib/Queue';
import NewDeliveryMail from '../jobs/NewDeliveryMail';

class DeliveryController {
  async index(req, res) {
    const delivery = await Delivery.findAll({
      where: {
        cancelled_at: null
      },
      include: [
        {
          model: DeliveryPerson,
          as: 'delivery_person',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['id', 'name', 'city', 'state']
        }
      ]
    });

    return res.json(delivery);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string().required(),
      recipient_id: Yup.number().required(),
      delivery_person_id: Yup.number().required()
    });

    const { delivery_person_id, recipient_id } = req.body;

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const delivery_person = await DeliveryPerson.findByPk(delivery_person_id);
    if (!delivery_person) {
      return res.status(400).json({ error: 'Delivery person does not exist' });
    }

    const recipient = await Recipient.findByPk(recipient_id);
    if (!recipient) {
      return res.status(400).json({ error: 'Recipient does not exist' });
    }

    const { id, product } = await Delivery.create(req.body);

    await Queue.add(NewDeliveryMail.key, {
      product,
      delivery_person
    });

    return res.json({
      id,
      product,
      recipient_id,
      delivery_person_id
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string(),
      recipient_id: Yup.number(),
      delivery_person_id: Yup.number()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const delivery = await Delivery.findByPk(req.params.id);
    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found' });
    }

    const delivery_person = await DeliveryPerson.findByPk(
      req.body.delivery_person_id
    );
    if (!delivery_person) {
      return res.status(400).json({ error: 'Delivery person does not exist' });
    }

    const recipient = await Recipient.findByPk(req.body.recipient_id);
    if (!recipient) {
      return res.status(400).json({ error: 'Recipient does not exist' });
    }

    const {
      id,
      product,
      recipient_id,
      delivery_person_id
    } = await delivery.update(req.body);

    return res.json({
      id,
      product,
      recipient_id,
      delivery_person_id
    });
  }

  async delete(req, res) {
    const delivery = await Delivery.findByPk(req.params.id);
    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found' });
    }

    delivery.cancelled_at = new Date();
    await delivery.save();
    return res.json({ id: req.params.id });
  }
}

export default new DeliveryController();
