const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const { spawn } = require('child_process');

// Enable detailed error logging
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

const app = express();
const PORT = process.env.PORT || 5000;

console.log('Starting server with environment:');
console.log('PORT:', PORT);
console.log('Python path:', process.env.PYTHON_PATH || 'Using system default');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Routes
app.post('/api/analyze', upload.single('resume'), async (req, res) => {
    console.log('Received request to /api/analyze');
    console.log('Request body:', req.body);
    console.log('File:', req.file);
    
    try {
        const { jobDescription, action } = req.body;
        const resumePath = req.file?.path;
        
        console.log('Processing with action:', action);
        console.log('Resume path:', resumePath);
        console.log('Job description length:', jobDescription?.length || 0);
        
        if (!resumePath || !fs.existsSync(resumePath)) {
            console.error('Resume file is required and must be uploaded');
            return res.status(400).json({ 
                error: 'Resume file is required',
                receivedFile: !!req.file,
                filePath: resumePath,
                fileExists: resumePath ? fs.existsSync(resumePath) : false
            });
        }
        
        if (!jobDescription) {
            console.error('Job description is required');
            return res.status(400).json({ 
                error: 'Job description is required',
                receivedDescription: !!jobDescription
            });
        }

        // Determine which Python script to run
        const scriptPath = action === 'analyze' ? 'AI/Analyse_ai.py' : 'AI/Enhancer_Ai.py';
        
        // Create a temporary file for the job description
        const jobDescFilePath = path.join('uploads', `job_${Date.now()}.txt`);
        fs.writeFileSync(jobDescFilePath, jobDescription);

        console.log(`Executing Python script: ${scriptPath}`);
        
        // Run the Python script with stdin input
        const pythonProcess = spawn('python3', [scriptPath]);
        let dataReceived = '';
        let errorReceived = '';
        
        // Send input to the Python script
        pythonProcess.stdin.write(`${resumePath}\n`);
        pythonProcess.stdin.write(`${jobDescription}\n`);
        pythonProcess.stdin.end();
        
        // Collect standard output
        pythonProcess.stdout.on('data', (data) => {
            const chunk = data.toString();
            dataReceived += chunk;
            console.log('Received data chunk:', chunk.substring(0, 200) + '...');
        });
        
        // Collect error output
        pythonProcess.stderr.on('data', (data) => {
            const chunk = data.toString();
            errorReceived += chunk;
            console.error('Received error chunk:', chunk);
        });
        
        // Handle process completion
        pythonProcess.on('close', (code) => {
            console.log(`Python process exited with code ${code}`);
            // Clean up temporary files
            if (fs.existsSync(resumePath)) {
                try {
                    fs.unlinkSync(resumePath);
                    console.log(`Deleted resume file: ${resumePath}`);
                } catch (e) {
                    console.error(`Error deleting resume file: ${e.message}`);
                }
            }
            
            if (fs.existsSync(jobDescFilePath)) {
                try {
                    fs.unlinkSync(jobDescFilePath);
                    console.log(`Deleted job description file: ${jobDescFilePath}`);
                } catch (e) {
                    console.error(`Error deleting job description file: ${e.message}`);
                }
            }
            
            console.log('Python script execution completed');
            console.log('Total output length:', dataReceived.length);
            
            if (code !== 0) {
                console.error(`Python process exited with error code: ${code}`);
                return res.status(500).json({ 
                    error: 'Error processing your request',
                    details: errorReceived || 'Unknown error',
                    exitCode: code
                });
            }
            
            if (errorReceived) {
                console.error('Python stderr output:', errorReceived);
            }

            try {
                // Extract the actual response content (removing the input prompts)
                const outputLines = dataReceived.split('\n');
                // Skip the first two lines which are input prompts
                let analysisResult = outputLines.slice(2).join('\n');
                
                if (action === 'analyze') {
                    // For analysis, we'll return the formatted analysis data
                    return res.json({
                        success: true,
                        result: analysisResult,
                        type: 'analysis'
                    });
                } else {
                    // For enhancement, check if we have an Enhanced_Resume.txt file
                    const enhancedPath = 'Enhanced_Resume.txt';
                    if (fs.existsSync(enhancedPath)) {
                        const enhancedContent = fs.readFileSync(enhancedPath, 'utf8');
                        res.json({
                            success: true,
                            result: enhancedContent,
                            type: 'enhancement'
                        });
                    } else {
                        // If no file was created, return the output
                        res.json({
                            success: true,
                            result: analysisResult,
                            type: 'enhancement_text'
                        });
                    }
                }
            } catch (parseError) {
                console.error('Parse Error:', parseError);
                res.status(500).json({ 
                    error: 'Error parsing results',
                    details: parseError.toString(),
                    rawOutput: dataReceived || null,
                    errorOutput: errorReceived || null
                });
            }
        });
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error in request:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: err.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// Start server
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Environment:', process.env.NODE_ENV || 'development');
});

// Handle server errors
server.on('error', (error) => {
    if (error.syscall !== 'listen') {
        throw error;
    }

    switch (error.code) {
        case 'EACCES':
            console.error(`Port ${PORT} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`Port ${PORT} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
});
