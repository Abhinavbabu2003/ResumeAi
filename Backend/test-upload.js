const FormData = require('form-data');
const fs = require('fs');
const fetch = require('node-fetch');

async function testUpload() {
    const form = new FormData();
    
    // Add file
    form.append('resume', fs.createReadStream('AI/ABHINAV20BABU20FULL20STACK20DEVELOPER-2-5.pdf'));
    
    // Add other fields
    form.append('jobDescription', 'Full Stack Developer with 2+ years of experience in React, Node.js, and MongoDB. Strong knowledge of RESTful APIs, database design, and cloud platforms.');
    form.append('action', 'analyze');

    try {
        console.log('Sending request to server...');
        const response = await fetch('http://localhost:5000/api/analyze', {
            method: 'POST',
            body: form
        });

        console.log('Response status:', response.status);
        const result = await response.text();
        console.log('Response body:', result);
        
    } catch (error) {
        console.error('Error:', error);
    }
}

testUpload();
