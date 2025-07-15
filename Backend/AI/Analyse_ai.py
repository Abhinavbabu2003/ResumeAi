import os
import re
import json
import google.generativeai as genai
from PyPDF2 import PdfReader
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class ResumeAnalyzer:
    def __init__(self):
        self.api_key = os.getenv('GEMINI_API_KEY')
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
        
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-2.0-flash')
    
    def extract_text(self, file_path):
        """Extract text from PDF or TXT files (for resume only)"""
        try:
            if file_path.endswith('.pdf'):
                with open(file_path, 'rb') as file:
                    reader = PdfReader(file)
                    text = '\n'.join([page.extract_text() for page in reader.pages])
            elif file_path.endswith('.txt'):
                with open(file_path, 'r') as file:
                    text = file.read()
            else:
                raise ValueError("Unsupported file format. Only PDF and TXT are supported.")
            
            if not text.strip():
                raise ValueError("The file appears to be empty or contains no readable text")
            
            return text
        except Exception as e:
            raise RuntimeError(f"Error reading file: {str(e)}")

    def analyze_resume(self, resume_text, job_description_text):
        """Analyze resume against job description using Gemini API"""
        prompt = f"""
        Analyze this resume against the provided job description and provide detailed feedback in JSON format with the following structure:
        {{
            "ats_score": "score out of 100 based on ATS compatibility",
            "match_score": "score out of 100 indicating resume-job alignment",
            "selection_chances": "score out of 100 estimating selection probability",
            "missing_sections": ["list of missing standard sections"],
            "missing_skills": ["list of job-required skills missing in resume"],
            "improvement_suggestions": ["list of specific improvement suggestions"],
            "keyword_analysis": {{
                "missing_keywords": ["list of missing job-specific keywords"],
                "overused_terms": ["list of overused terms"]
            }},
            "formatting_issues": ["list of formatting issues"],
            "strengths": ["list of resume strengths relevant to the job"],
            "tailored_suggestions": ["specific suggestions to better align with job description"]
        }}

        Resume Content:
        {resume_text}

        Job Description:
        {job_description_text}

        Be strict but constructive. Focus on:
        - Key qualifications match
        - Skills gap analysis
        - Keyword optimization for ATS
        - Actionable suggestions for improvement
        - Realistic selection probability estimation
        """
        
        try:
            response = self.model.generate_content(prompt)
            return self._parse_response(response.text)
        except Exception as e:
            raise RuntimeError(f"API Error: {str(e)}")

    def _parse_response(self, response_text):
        """Parse the Gemini API response into JSON"""
        try:
            cleaned_text = re.sub(r'^```json\s*|\s*```$', '', response_text, flags=re.MULTILINE)
            return json.loads(cleaned_text)
        except json.JSONDecodeError:
            raise ValueError("Failed to parse API response. Invalid JSON format")

def main():
    try:
        analyzer = ResumeAnalyzer()
        
        # Get resume path and job description text
        resume_path = input("Enter path to your resume (PDF/TXT): ").strip()
        job_desc_text = input("Paste the job description here: ").strip()
        
        # Extract resume text
        resume_text = analyzer.extract_text(resume_path)
        
        # Analyze resume against job description
        analysis = analyzer.analyze_resume(resume_text, job_desc_text)
        
        # Display results (same as before)
        print("\nResume Analysis Results:")
        print(f"ATS Compatibility Score: {analysis.get('ats_score', 'N/A')}/100")
        print(f"Job Match Score: {analysis.get('match_score', 'N/A')}/100")
        print(f"Selection Probability: {analysis.get('selection_chances', 'N/A')}%")
        
        print("\nMissing Standard Sections:")
        for section in analysis.get('missing_sections', []):
            print(f"- {section}")
            
        print("\nMissing Required Skills:")
        for skill in analysis.get('missing_skills', []):
            print(f"- {skill}")
            
        print("\nJob-Specific Suggestions:")
        for suggestion in analysis.get('tailored_suggestions', []):
            print(f"- {suggestion}")
            
        print("\nKeyword Analysis:")
        print("Missing Keywords:", ", ".join(analysis.get('keyword_analysis', {}).get('missing_keywords', [])))
        print("Overused Terms:", ", ".join(analysis.get('keyword_analysis', {}).get('overused_terms', [])))
        
        print("\nStrengths Highlight:")
        for strength in analysis.get('strengths', []):
            print(f"- {strength}")
            
        print("\nGeneral Improvement Suggestions:")
        for suggestion in analysis.get('improvement_suggestions', []):
            print(f"- {suggestion}")
            
    except Exception as e:
        print(f"\nError: {str(e)}")

if __name__ == "__main__":
    main()