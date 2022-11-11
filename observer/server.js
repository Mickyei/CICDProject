const express = require("express");

var amqp = require('amqplib/callback_api');
var fs = require('fs');
const { FILE } = require("dns");
const url = 'amqp://rabbitmq';
const receivequeue = 'compse140.o';
const sendqueue = 'compse140.i';
const queue = 'compse140.#';
const FILELOCATION = "/var/lib/observer/data/messages.txt";
//Clear all text from FILELOCATION
fs.writeFileSync(FILELOCATION, '', 'utf-8');
counter = 0;
let channel = null;
amqp.connect(url, function (err, conn) {

    if (err) {
        console.log(err);
        throw new Error(`AMQP connection not available on ${url}`);
    }
    conn.createChannel(async function (err, ch) {
        channel = ch;
        channel.assertExchange(receivequeue,"topic", {
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
          //Subscribe to topics
          channel.bindQueue(q.queue, receivequeue, "compse140.o");
          channel.bindQueue(q.queue, sendqueue, "compse140.i");

          //When receiving a message, create a string result and append it to the FILELOCATION
          channel.consume(q.queue, function(msg) {
              counter ++;
              const timestamp = new Date().toISOString();
              const res = `${timestamp} ${counter} ${msg.content.toString()} to ${msg.fields.routingKey} \n`;
              const logtext = `${timestamp} ${counter} ${msg.content.toString()} to ${msg.fields.routingKey}`;
              console.log(logtext);
              fs.writeFileSync(FILELOCATION, res, 
                {flag: "a"});

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
