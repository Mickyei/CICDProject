const express = require("express");

var amqp = require('amqplib/callback_api');
const url = 'amqp://rabbitmq';
const receivequeue = 'compse140.o';
const sendqueue = 'compse140.i'

let channel = null;
amqp.connect(url, function (err, conn) {

    if (err) {
        console.log(err);
        throw new Error(`AMQP connection not available on ${url}`);
    }
    conn.createChannel(async function (err, ch) {
        channel = ch;
        counter = 1;
//Make sure the topics are asserted
        channel.assertExchange(receivequeue, "topic", {
            durable: false
          });

        channel.assertExchange(sendqueue, "topic",{
            durable: false
        });

        channel.assertQueue('', {
            exclusive:true
        }, function(error2, q){
            if(error2) {
                throw error2
            }
            //Subscribe to topic compse140.o
            channel.bindQueue(q.queue, receivequeue, "compse140.o");

            //Send received messages to topic compse140.i
            channel.consume(q.queue, async function(msg) {
                await timeout(1000);
                console.log(" [x] Got %s:'%s'", msg.fields.routingKey, msg.content.toString());
                channel.publish(sendqueue,"compse140.i", Buffer.from("Got " + msg.content.toString()));
              }, {
                noAck: true
              });
        });
        
        
    });
})

process.on('exit', code => {
    channel.close();
    console.log(`Closing`);
  });


function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
