const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const https = require('https')
require('dotenv').config()

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

// our own packages
const utils = require('./utils')
const api = require('./api')

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Route to handle file upload
app.post('/upload', upload.single('csvFile'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    // Call truphone API with data sent from customer
    const filePath = path.join(__dirname, req.file.path);
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading file.');
        }

        // this function calls the Truphone API.
        makeTruphoneApiCalls(data);
        res.send('File processed successfully!');
        
        // Clean up file after processing
        fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) console.error('Error deleting file:', unlinkErr);
        });
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// function for waiting
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const makeTruphoneApiCalls = async function(csv) {
    // parse and organise data
    const organisedData = utils.organiseRequestDataIntoJson(utils.csvStringToArray(csv))

    // get a list of every single tag in use across Truphone
    const allTagsInUse = await api.getAllTagsInUse()

    // unassign all tags
    await (async () => {
        const promises = [];
        // get list of unique iccids
        const uniqueIccids = [...new Set(Object.values(organisedData["Tags"]).flat())];
            allTagsInUse.forEach((tag) => {
                promises.push(api.makeApiCallToUnassignTags(tag, uniqueIccids))
            })
        await Promise.all(promises)
    })();
    
    // add back the ones we want
    for (const [tag, iccids] of Object.entries(organisedData["Tags"])){
        api.makeApiCallToSetTags(tag, iccids)
    }

    // set labels because this is done differently to attributes for some reason
    for (const [label, iccids]of Object.entries(organisedData["Label"])){
        iccids.forEach(iccid => {
            api.makeApiCallToSetLabel(label, iccid)
        });
    }

    // set attributes
    for (const [attribute, values] of Object.entries(organisedData)){
        if (attribute == "Tags" || attribute == "Label") {
            continue
        }
        for (const [value, iccids] of Object.entries(values)){
            api.makeApiCallToSetAttributes(attribute, value, iccids)        
        } 
    }
}

