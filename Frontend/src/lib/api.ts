// API client for Resume AI backend

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Analyzes a resume against a job description
 */
export async function analyzeResume(resume: File, jobDescription: string) {
  console.log('Analyzing resume:', { resumeName: resume.name, jobDescriptionLength: jobDescription.length });
  
  const formData = new FormData();
  formData.append('resume', resume, resume.name); // Include filename explicitly
  formData.append('jobDescription', jobDescription);
  formData.append('action', 'analyze');

  try {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(`Analysis failed: ${response.statusText} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

/**
 * Enhances a resume to better match a job description
 */
export async function enhanceResume(resume: File, jobDescription: string) {
  console.log('Enhancing resume:', { resumeName: resume.name, jobDescriptionLength: jobDescription.length });
  
  const formData = new FormData();
  formData.append('resume', resume, resume.name); // Include filename explicitly
  formData.append('jobDescription', jobDescription);
  formData.append('action', 'enhance');

  try {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(`Enhancement failed: ${response.statusText} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}
