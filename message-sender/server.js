const express = require("express");

var amqp = require('amqplib/callback_api');
const url = 'amqp://rabbitmq';
const queue = 'compse140.o';

let channel = null;
amqp.connect(url, function (err, conn) {

    if (err) {
        console.log(err);
        throw new Error(`AMQP connection not available on ${url}`);
    }
    conn.createChannel(async function (err, ch) {

        channel = ch;
        channel.assertExchange(queue, "topic",{
            durable: false
          });
        counter = 1;
        //Send 3 messages to topic compse140.o
        while(counter <= 3) {
            await timeout(3000)
            channel.publish(queue,"compse140.o", Buffer.from("MSG_" + counter));
            console.log("MSG_" + counter);
            counter++;
            
        }
        
        
    });
})

process.on('exit', code => {
    channel.close();
    console.log(`Closing`);
  });


function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
