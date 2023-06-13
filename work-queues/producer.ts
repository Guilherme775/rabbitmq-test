import amqp from "amqplib/callback_api";

amqp.connect("amqp://localhost", (error0, connection) => {
  if (error0) throw error0;

  connection.createChannel((error1, channel) => {
    if (error1) throw error1;

    const exchange = "messages-exchange";

    // make exchange durable so content exchange will not be lost if the producer dies
    channel.assertExchange(exchange, "direct", { durable: true });

    // make message persistent so message will not be lost if the producer dies
    channel.publish(exchange, "messages", Buffer.from("1"), {
      persistent: true,
    });
    channel.publish(exchange, "messages", Buffer.from("2"), {
      persistent: true,
    });
    channel.publish(exchange, "messages", Buffer.from("3"), {
      persistent: true,
    });
    channel.publish(exchange, "messages", Buffer.from("4"), {
      persistent: true,
    });
  });
});
