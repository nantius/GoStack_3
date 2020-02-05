import * as Yup from 'yup';
import DeliveryPerson from '../models/DeliveryPerson';
import File from '../models/File';

class DeliveryPersonController {
  async index(req, res) {
    const delivery_people = await DeliveryPerson.findAll({
      where: { deleted_at: null },
      attributes: ['id', 'name', 'email', 'avatar_id'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url']
        }
      ]
    });

    return res.json(delivery_people);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      avatar_id: Yup.number().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const deli_person = await DeliveryPerson.findOne({
      where: { email: req.body.email }
    });
    if (deli_person) {
      return res.status(400).json({ error: 'Email already taken!' });
    }

    const file = await File.findByPk(req.body.avatar_id);
    if (!file) {
      res.status(400).json({ error: "The avatar provided doesn't exist!" });
    }

    const { name, email, avatar_id } = await DeliveryPerson.create(req.body);

    return res.json({
      name,
      email,
      avatar_id
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      avatar_id: Yup.number()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const delivery_person = await DeliveryPerson.findByPk(req.params.id);

    if (!delivery_person) {
      res.status(400).json({ error: "Delivery Person doesn't exist." });
    }

    if (req.body.email && req.body.email !== delivery_person.email) {
      const email_test = await DeliveryPerson.findOne({
        where: { email: req.body.email }
      });

      if (email_test) {
        return res.status(400).json({ error: 'Email is already in use.' });
      }
    }

    const { avatar_id, name, email, updated_at } = await delivery_person.update(
      req.body
    );

    return res.json({
      avatar_id,
      name,
      email,
      updated_at
    });
  }

  async delete(req, res) {
    const delivery_person = await DeliveryPerson.findByPk(req.params.id);

    if (!delivery_person) {
      res.status(400).json({ error: "Delivery Person doesn't exist." });
    }

    delivery_person.deleted_at = new Date();
    await delivery_person.save();
    return res.json({ id: req.params.id });
  }
}
export default new DeliveryPersonController();
