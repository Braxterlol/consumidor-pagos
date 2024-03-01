import amqp from 'amqplib';
import axios from 'axios';


amqp.connect('amqp://23.22.15.136').then(async (connection) => {
  try {
    const channel = await connection.createChannel();
    const queue = 'pagos';

    await channel.assertQueue(queue, { durable: true });

    console.log(" [*] Waiting for messages...", queue);
    channel.consume('pagos', async (msg) => {
        if (msg !== null) {
          const paymentData = JSON.parse(msg.content.toString());
      
          try {
            const response = await axios.post('http://localhost:4000/procesar-pago', paymentData);
            console.log('Pago procesado:', response.data);
          } catch (error) {
            console.error('Error al procesar el pago:', error);
          }
        } else {
          console.log("No hay mensajes en la cola por el momento.");
        }
       });
  } catch (error) {
    console.error('Error al conectar al canal:', error);
  }
}).catch((error) => {
  console.error('Error al conectar a RabbitMQ:', error);
});

