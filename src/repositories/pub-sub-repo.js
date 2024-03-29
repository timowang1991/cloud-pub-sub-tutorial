module.exports = {
    publishMessage: async (pubSubClient, topicName, payload, attributes) => {
        const dataBuffer = Buffer.from(JSON.stringify(payload));

        const messageId = await pubSubClient.topic(topicName).publish(dataBuffer, attributes);
        console.log(`Message ${messageId} published.`);
        return messageId;
    },

    listenForPullMessages: (pubSubClient, subscriptionName,  timeout) => {
        const subscription = pubSubClient.subscription(subscriptionName);

        let messageCount = 0;
        const messageHandler = message => {
            console.log(`Received message ${message.id}:`);
            console.log(`\tData: ${message.data}`);
            console.log(`\tAttributes: ${JSON.stringify(message.attributes, null, 4)}`);
            messageCount += 1;

            message.ack();
        };

        subscription.on('message', messageHandler);

        setTimeout(() => {
            subscription.removeListener('message', messageHandler);
            console.log(`${messageCount} message(s) received.`);
        }, timeout * 1000);
    }

};