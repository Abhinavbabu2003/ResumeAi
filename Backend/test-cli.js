const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const fetch = require('node-fetch');

// Configuration
const API_URL = 'http://localhost:5000/api/analyze';
const RESUME_PATH = 'AI/Preet_Re7.pdf';
const JOB_DESCRIPTION = 'Full Stack Developer with experience in React and Node.js';
const ACTION = 'analyze'; // or 'enhance'

async function testApi() {
    console.log('Testing Resume AI API...');
    console.log(`Resume: ${RESUME_PATH}`);
    console.log(`Action: ${ACTION}`);
    console.log('Sending request...');
    
    // Check if resume file exists
    if (!fs.existsSync(RESUME_PATH)) {
        console.error(`Error: Resume file not found at ${RESUME_PATH}`);
        return;
    }
    
    // Create form data
    const form = new FormData();
    form.append('resume', fs.createReadStream(RESUME_PATH));
    form.append('jobDescription', JOB_DESCRIPTION);
    form.append('action', ACTION);
    
    try {
        // Send request
        const response = await fetch(API_URL, {
            method: 'POST',
            body: form
        });
        
        // Check if request was successful
        if (!response.ok) {
            console.error(`Error: HTTP ${response.status} - ${response.statusText}`);
            const text = await response.text();
            console.error(text);
            return;
        }
        
        // Parse response
        const result = await response.json();
        console.log('\nAPI Response:');
        console.log(JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Run the test
testApi();
