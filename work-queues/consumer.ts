import amqp from "amqplib/callback_api";
import { delay } from "./delay";

amqp.connect("amqp://localhost", (error0, connection) => {
  if (error0) throw error0;

  connection.createChannel((error1, channel) => {
    if (error1) throw error1;

    const exchange = "messages-exchange";
    const queue = "queue";

    // make queue durable so content queue will not be lost if the consumer dies
    channel.assertQueue(queue, { durable: true });

    channel.bindQueue(queue, exchange, "messages");

    /* 
        This tells RabbitMQ not to give more than one message to a worker at a time. 
        Or, in other words, don't dispatch a new message to a worker until it has processed and acknowledged the previous one.
    */
    channel.prefetch(1);

    console.log("[*] Waiting for messages in %s. To exit press CTRL+C", queue);
    channel.consume(
      queue,
      async (msg) => {
        if (msg) {
          // Five seconds to emulate some job
          await delay(5000);

          console.log(`Job ${msg.content.toString()} finished!`);

          // acknowledged the consumed message
          channel.ack(msg);
        }
      },
      // Disable automatic acknowledgment
      { noAck: false }
    );
  });
});
