import amqp from "amqplib/callback_api";

amqp.connect("amqp://localhost", (error0, connection) => {
  if (error0) throw error0;

  connection.createChannel((error1, channel) => {
    if (error1) throw error1;

    // with "" rabbitmq will create an queue with a random name
    // when the connection that declared it closes, the queue will be deleted because it is declared as exclusive
    channel.assertQueue("", { exclusive: true }, (error2, q) => {
      if (error2) throw error2;

      // bind an temporary queue to our exchange
      channel.bindQueue(q.queue, "direct-exchange", "errors");

      channel.consume(q.queue, async (msg) => {
        if (msg) console.log(JSON.stringify(msg.content.toString()));
      });
    });
  });
});
