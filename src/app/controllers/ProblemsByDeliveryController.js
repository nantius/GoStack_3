import * as Yup from 'yup';
import DeliveryProblem from '../models/DeliveryProblem';
import Delivery from '../models/Delivery';

class ProblemsByDeliveryController {
  async index(req, res) {
    const delivery = await Delivery.findByPk(req.params.id);
    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found' });
    }

    const problems = await DeliveryProblem.findAll({
      where: {
        delivery_id: req.params.id
      }
    });

    return res.json(problems);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const delivery = await Delivery.findByPk(req.params.id);
    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found.' });
    }

    const problem = await DeliveryProblem.create({
      description: req.body.description,
      delivery_id: req.params.id
    });

    return res.json(problem);
  }
}

export default new ProblemsByDeliveryController();
