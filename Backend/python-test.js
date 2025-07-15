const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Setup for the test
const resumePath = 'AI/Preet_Re7.pdf';
const jobDescription = 'Full Stack Developer with React and Node.js experience';
const scriptPath = 'AI/Analyse_ai.py';

// Create a temporary file for the job description
const jobDescPath = path.join('uploads', 'job_test.txt');
fs.writeFileSync(jobDescPath, jobDescription);

console.log('Starting Python test...');
console.log(`Resume: ${resumePath}`);
console.log(`Job Description: ${jobDescription}`);
console.log(`Script: ${scriptPath}`);

// Run the Python script with stdin input
const pythonProcess = spawn('python3', [scriptPath]);
let dataReceived = '';
let errorReceived = '';

// Send input to the Python script
pythonProcess.stdin.write(`${resumePath}\n`);
pythonProcess.stdin.write(`${jobDescription}\n`);
pythonProcess.stdin.end();

// Collect output
pythonProcess.stdout.on('data', (data) => {
    const chunk = data.toString();
    dataReceived += chunk;
    console.log('Received data chunk:', chunk);
});

pythonProcess.stderr.on('data', (data) => {
    const chunk = data.toString();
    errorReceived += chunk;
    console.error('Received error chunk:', chunk);
});

// Handle completion
pythonProcess.on('close', (code) => {
    console.log(`Python process exited with code ${code}`);
    console.log('Total output length:', dataReceived.length);
    console.log('First 500 chars of output:', dataReceived.substring(0, 500));
    
    if (errorReceived) {
        console.error('Error output:', errorReceived);
    }
    
    // Clean up
    if (fs.existsSync(jobDescPath)) {
        fs.unlinkSync(jobDescPath);
    }
});
