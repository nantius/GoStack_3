import Mail from '../../lib/Mail';

class NewDeliveryMail {
  get key() {
    return 'NewDeliveryMail';
  }

  async handle({ data }) {
    const { product, delivery_person } = data;
    await Mail.sendMail({
      to: `${delivery_person.name} <${delivery_person.email}>`,
      subject: 'New Order',
      template: 'new_delivery',
      context: {
        product,
        name: delivery_person.name
      }
    });
  }
}

export default new NewDeliveryMail();
