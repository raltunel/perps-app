// netlify/functions/log.js
exports.handler = async function (event) {
    console.log("LOG:", JSON.parse(event.body).message);
    return {
        statusCode: 200,
        body: JSON.stringify({ received: true })
    };
};
