const FormData = require('form-data');
const fs = require('fs');
const fetch = require('node-fetch');

async function testAnalysis() {
    const form = new FormData();
    
    // Add file
    form.append('resume', fs.createReadStream('AI/ABHINAV20BABU20FULL20STACK20DEVELOPER-2-5.pdf'));
    
    // Add other fields
    form.append('jobDescription', 'Full Stack Developer with 2+ years of experience in React, Node.js, and MongoDB. Strong knowledge of RESTful APIs, database design, and cloud platforms.');
    form.append('action', 'analyze');

    try {
        const response = await fetch('http://localhost:5000/api/analyze', {
            method: 'POST',
            body: form
        });

        const result = await response.json();
        console.log('Analysis Result:', JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
}

testAnalysis();
