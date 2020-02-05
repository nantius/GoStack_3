import * as Yup from 'yup';
import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      city: Yup.string().required(),
      address: Yup.string().required(),
      extra_info: Yup.string(),
      zip: Yup.string().required(),
      state: Yup.string().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const { id, name, city, address, zip, state } = await Recipient.create(
      req.body
    );

    return res.json({
      id,
      name,
      city,
      address,
      zip,
      state
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      city: Yup.string(),
      address: Yup.string(),
      state: Yup.string(),
      extra_info: Yup.string()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const recipient = await Recipient.findByPk(req.params.id);
    if (!recipient) {
      return res.status(400).json({ error: 'Recipient does not exist.' });
    }

    const { id, name, city, address, state } = await recipient.update(req.body);

    return res.json({
      id,
      name,
      city,
      address,
      state
    });
  }
}

export default new RecipientController();
