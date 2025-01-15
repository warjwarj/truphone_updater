const https = require('https')
const utils = require ('./utils')

// this function sets the tagname given for all SIMs in the array parameter.
exports.makeApiCallToSetTags = function(tagName, iccids) {
    // replace whitespace in string with special char
    tagName = tagName.trim()
    tagName = tagName.replace(/\s/g, "%20");
    // payload body
    const body = JSON.stringify({
        "simCards": iccids
    })
    // Set up the request options
    const options = {
        hostname: 'iot.truphone.com',
        post: 443,
        path: `/api/v2.0/tags/${tagName}/sims`,
        method: 'POST',
        headers: {
            'Authorization': process.env.AUTH_TOKEN,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body)
        }
    };
    return sendApiRequest(options, body)
}

// this function sets the tagname given for all SIMs in the array parameter.
exports.makeApiCallToUnassignTags = function(tagName, iccids) {
    // repalce whitespace in string with special char
    tagName = tagName.trim()
    tagName = tagName.replace(/\s/g, "%20");
    // payload body
    const body = JSON.stringify({
        "simCards": iccids
    })
    // Set up the request options
    const options = {
        hostname: 'iot.truphone.com',
        post: 443,
        path: `/api/v2.0/tags/${tagName}/sims`,
        method: 'DELETE',
        headers: {
            'Authorization': process.env.AUTH_TOKEN,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body)
        }
    };
    return sendApiRequest(options, body)
}


// this function sets the tagname given for all SIMs in the array parameter.
exports.makeApiCallToSetAttributes = function(attribute, value, iccids) {
    // repalce whitespace in string with special char
    attribute = attribute.trim()
    attribute = attribute.replace(/\s/g, "%20");
    // payload body
    const body = JSON.stringify({
        "simCards": iccids,
        "value": value
    })
    // Set up the request options
    const options = {
        hostname: 'iot.truphone.com',
        post: 443,
        path: `/api/v2.0/attributes/${attribute}`,
        method: 'PATCH',
        headers: {
            'Authorization': process.env.AUTH_TOKEN,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body)
        }
    };
    return sendApiRequest(options, body)
}

// this function sets label of the SIM provided to the given value
exports.makeApiCallToSetLabel = function(label, iccid) {
    // repalce whitespace in string with special char
    label = label.trim()
    // payload body
    const body = JSON.stringify({
        "label": label
    })
    // Set up the request options
    const options = {
        hostname: 'iot.truphone.com',
        post: 443,
        path: `/api/v2.2/sims/${iccid}`,
        method: 'PATCH',
        headers: {
            'Authorization': process.env.AUTH_TOKEN,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body)
        }
    };
    return sendApiRequest(options, body)
}

// this function sets label of the SIM provided to the given value
exports.getAllTagsInUse = function() {
    // Set up the request options
    const options = {
        hostname: 'iot.truphone.com',
        post: 443,
        path: `/api/v2.0/tags`,
        method: 'GET',
        headers: {
            'Authorization': process.env.AUTH_TOKEN,
            'Content-Type': 'application/json',
        }
    };
    return sendApiRequest(options, "")
}

// this function sets label of the SIM provided to the given value
exports.getAllSims = function() {
    // Set up the request options
    const options = {
        hostname: 'iot.truphone.com',
        post: 443,
        path: `/api/v2.2/sims`,
        method: 'GET',
        headers: {
            'Authorization': process.env.AUTH_TOKEN,
        }
    };
    return sendApiRequest(options, "")
}

// Create a persistent connection pool using an Agent
const agent = new https.Agent({
    keepAlive: true, // Keep sockets alive for reuse
    maxSockets: 10,  // Limit the number of sockets in the pool
    maxFreeSockets: 5, // Limit the number of idle sockets
    timeout: 60000, // Socket timeout in milliseconds
    scheduling: 'fifo'
});

const sendApiRequest = function (options, body) {
    return new Promise((resolve, reject) => {
        options.agent = agent
        // Make the HTTP request
        const req = https.request(options, (res) => {
            // Inspect rate-limiting headers
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                console.log(data)
                resolve(data); // Successfully completed request
            });
        });
        // Declare error handling callback
        req.on('error', (e) => {
            console.error(`Problem with request: ${e.message}`);
            resolve(new Error(`Problem with request: ${e.message}`));
        });
        // Send request data
        req.write(body);
        req.end();
    });
};