const https = require('https')

// this function sets the tagname given for all SIMs in the array parameter.
exports.makeApiCallToSetTags = function(tagName, iccids) {
    return new Promise ((resolve, reject) => {
        // replace whitespace in string with special char
        tagName = tagName.trim()
        tagName = tagName.replace(/\s/g, "%20");

        // payload body
        const postData = JSON.stringify({
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
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        // Make the HTTP request
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => {
                data += chunk;
            });
            res.on('end', () => {
                console.log(`Update tag result:`, data);
                resolve()
            });
        });
        // declare error handling callback
        req.on('error', (e) => {
            console.error(`Problem with request: ${e.message}`);
            reject(new Error(`Problem with request: ${e.message}`));
        });
        // send req and close conn
        req.write(postData);
        req.end();
    })
}

// this function sets the tagname given for all SIMs in the array parameter.
exports.makeApiCallToUnassignTags = function(tagName, iccids) {
    return new Promise ((resolve, reject) => {
        // repalce whitespace in string with special char
        tagName = tagName.trim()
        tagName = tagName.replace(/\s/g, "%20");

        // payload body
        const postData = JSON.stringify({
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
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        // Make the HTTP request
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => {
                data += chunk;
            });
            res.on('end', () => {
                console.log(`Unassign tag result ${tagName} from ${iccids}:`, data);
                resolve()
            });
        });
        // declare error handling callback
        req.on('error', (e) => {
            console.error(`Problem with request: ${e.message}`);
            reject(new Error(`Problem with request: ${e.message}`));
        });
        // send req and close conn
        req.write(postData);
        req.end();
    })
}


// this function sets the tagname given for all SIMs in the array parameter.
exports.makeApiCallToSetAttributes = function(attribute, value, iccids) {
    return new Promise ((resolve, reject) => {
        // repalce whitespace in string with special char
        attribute = attribute.trim()
        attribute = attribute.replace(/\s/g, "%20");

        // payload body
        const patchData = JSON.stringify({
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
                'Content-Length': Buffer.byteLength(patchData)
            }
        };

        // Make the HTTP request
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => {
                data += chunk;
            });
            res.on('end', () => {
                console.log(`Attribute ${attribute} update result: `, data);
                resolve()
            });
        });
        // Declare error handling callback
        req.on('error', (e) => {
            console.error(`Problem with request: ${e.message}`);
            reject(new Error(`Problem with request: ${e.message}`));
        });
        // Send req data
        req.write(patchData);
        req.end();
    })
}

// this function sets label of the SIM provided to the given value
exports.makeApiCallToSetLabel = function(label, iccid) {
    return new Promise ((resolve, reject) => {
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

        // Make the HTTP request
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => {
                data += chunk;
            });
            res.on('end', () => {
                console.log(`Label ${label} update result:`, data);
                resolve()
            });
        });
        // Declare error handling callback
        req.on('error', (e) => {
            console.error(`Problem with request: ${e.message}`);
            reject(new Error(`Problem with request: ${e.message}`));
        });
        // Send req data
        req.write(body);
        req.end();
    })
}

// this function sets label of the SIM provided to the given value
exports.getAllTagsInUse = function() {
    return new Promise ((resolve, reject) => {
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

        // Make the HTTP request
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    const labels = JSON.parse(data).map(item => item.label);
                    resolve(labels);
                } catch (err) {
                    reject(err);
                 }
            });
        });
        // Declare error handling callback
        req.on('error', (e) => {
            reject(new Error(`Problem with request: ${e.message}`));
        });
        // Send req data
        req.write("");
        req.end();
    })
}

const sendApiRequest = function(options, body){
    // Make the HTTP request
    const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => {
            data += chunk;
        });
        res.on('end', () => {
            resolve()
        });
    });
    // Declare error handling callback
    req.on('error', (e) => {
        console.error(`Problem with request: ${e.message}`);
        reject(new Error(`Problem with request: ${e.message}`));
    });
    // Send req data
    req.write(body);
    req.end();
}