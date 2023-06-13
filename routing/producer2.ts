import amqp from "amqplib/callback_api";

amqp.connect("amqp://localhost", (error0, connection) => {
  if (error0) throw error0;

  connection.createChannel((error1, channel) => {
    if (error1) throw error1;

    // create the fanout exchange
    channel.assertExchange("direct-exchange", "direct", { durable: true });

    // publish an message to the exchange
    channel.publish("direct-exchange", "errors", Buffer.from("Hello World2!"));
  });
});
