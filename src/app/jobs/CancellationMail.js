import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'CancellationMail';
  }

  async handle({ data }) {
    const { product, delivery_person, problem } = data;
    await Mail.sendMail({
      to: `${delivery_person.name} <${delivery_person.email}>`,
      subject: 'Order Cancelled',
      template: 'cancellation',
      context: {
        problem,
        product,
        name: delivery_person.name
      }
    });
  }
}

export default new CancellationMail();
