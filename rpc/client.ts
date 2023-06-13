import amqp from "amqplib/callback_api";

function generateUuid() {
  return (
    Math.random().toString() +
    Math.random().toString() +
    Math.random().toString()
  );
}

amqp.connect("amqp://localhost", function (error0, connection) {
  if (error0) {
    throw error0;
  }

  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }

    channel.assertQueue(
      "",
      {
        exclusive: true,
      },
      (error2, q) => {
        if (error2) {
          throw error2;
        }

        const correlationId = generateUuid();
        const num = 5;

        console.log(" [x] Requesting fib(%d)", num);

        channel.consume(
          q.queue,
          function (msg) {
            if (msg && msg.properties.correlationId == correlationId) {
              console.log(" [.] Got %s", msg.content.toString());
            }
          },
          {
            noAck: true,
          }
        );

        channel.sendToQueue("rpc_queue", Buffer.from(num.toString()), {
          correlationId: correlationId,
          replyTo: q.queue,
        });
      }
    );
  });
});
