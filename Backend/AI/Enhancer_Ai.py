import os
import re
import json
import google.generativeai as genai
from PyPDF2 import PdfReader
from dotenv import load_dotenv
from fpdf import FPDF
import textwrap

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
        """Extract text from PDF or TXT files"""
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

    def analyze_and_enhance(self, resume_text, job_description_text):
        """Analyze resume and generate enhanced version"""
        try:
            # First get analysis internally
            analysis = self._get_analysis(resume_text, job_description_text)
            
            # Generate enhanced resume
            enhanced_resume = self._generate_enhanced_version(
                resume_text, 
                job_description_text,
                analysis
            )
            
            # Return only the enhanced resume content
            return enhanced_resume
        except Exception as e:
            raise RuntimeError(f"Processing error: {str(e)}")

    def _get_analysis(self, resume_text, job_description_text):
        """Get resume analysis"""
        prompt = f"""
        Analyze this resume against the provided job description and provide detailed feedback in JSON format:
        {{
            "ats_score": "score out of 100",
            "missing_sections": ["list of missing sections"],
            "missing_skills": ["list of missing skills"],
            "keyword_analysis": {{
                "missing_keywords": ["list of missing keywords"],
                "overused_terms": ["list of overused terms"]
            }},
            "improvement_suggestions": ["list of suggestions"]
        }}

        Resume:
        {resume_text}

        Job Description:
        {job_description_text}
        """
        
        response = self.model.generate_content(prompt)
        return self._parse_response(response.text)

    def _generate_enhanced_version(self, resume_text, job_description_text, analysis):
        """Generate enhanced resume"""
        prompt = f"""
        Rewrite this resume to address the following issues and optimize for the job description:
        
        Analysis Results:
        - Missing Sections: {', '.join(analysis.get('missing_sections', []))}
        - Missing Skills: {', '.join(analysis.get('missing_skills', []))}
        - Missing Keywords: {', '.join(analysis.get('keyword_analysis', {}).get('missing_keywords', []))}
        - Suggestions: {', '.join(analysis.get('improvement_suggestions', []))}

        Job Description:
        {job_description_text}

        Original Resume:
        {resume_text}

        Requirements:
        - Add missing sections/skills/keywords
        - Use professional formatting
        - Include quantifiable achievements
        - Use bullet points
        - Keep it concise (1-2 pages)
        - Use action verbs
        - Focus on job-relevant information

        Provide ONLY the enhanced resume content without any explanations.
        Use proper section headers and formatting.
        """
        
        response = self.model.generate_content(prompt)
        return response.text

    def _parse_response(self, response_text):
        """Parse the API response"""
        try:
            cleaned_text = re.sub(r'^```json\s*|\s*```$', '', response_text, flags=re.MULTILINE)
            return json.loads(cleaned_text)
        except json.JSONDecodeError:
            raise ValueError("Failed to parse API response")

class ResumePDF(FPDF):
    """PDF generator for resumes"""
    def __init__(self):
        # Initialize with UTF-8 encoding support
        super().__init__('P', 'mm', 'A4')
        self.set_auto_page_break(auto=True, margin=15)

    def header(self):
        self.set_font('Arial', 'B', 12)
        self.cell(0, 10, 'Enhanced Resume', 0, 1, 'C')
    
    def add_section(self, title, body):
        self.set_font('Arial', 'B', 12)
        self.cell(0, 10, title, 0, 1)
        self.set_font('Arial', '', 11)
        for line in body.split('\n'):
            # Clean the text to remove problematic characters
            line = line.encode('latin-1', 'replace').decode('latin-1')
            wrapped = textwrap.wrap(line, width=90)
            for wrap_line in wrapped:
                self.multi_cell(0, 6, wrap_line)
        self.ln(4)

def save_as_pdf(content, filename):
    """Save enhanced resume as PDF"""
    # Clean the content to handle encoding issues
    try:
        content = content.encode('latin-1', 'replace').decode('latin-1')
    except UnicodeError:
        content = content.encode('ascii', 'replace').decode('ascii')

    pdf = ResumePDF()
    pdf.add_page()
    
    # Split content into sections
    sections = re.split(r'\n(?=[A-Z][a-zA-Z ]+:)', content)
    for section in sections:
        if ':' in section:
            title, body = section.split(':', 1)
            pdf.add_section(title.strip(), body.strip())
        else:
            pdf.add_section('Professional Summary', section.strip())
    
    try:
        pdf.output(filename)
    except Exception as e:
        raise RuntimeError(f"Failed to create PDF file: {str(e)}")

    # Verify the PDF was created successfully
    if not os.path.exists(filename):
        raise RuntimeError(f"Failed to create PDF file: {filename}")

def main():
    try:
        analyzer = ResumeAnalyzer()
        
        # Get user inputs
        resume_path = input("Enter path to your resume (PDF/TXT): ").strip()
        job_desc = input("Paste job description: ").strip()
        
        # Process documents
        resume_text = analyzer.extract_text(resume_path)
        enhanced_content = analyzer.analyze_and_enhance(resume_text, job_desc)
        
        # Save enhanced resume
        # Save as TXT
        txt_path = 'Enhanced_Resume.txt'
        with open(txt_path, 'w') as f:
            f.write(enhanced_content)
        
        # Save as PDF
        pdf_path = 'Enhanced_Resume.pdf'
        save_as_pdf(enhanced_content, pdf_path)
        
        print(f"\nEnhancement Complete!\nEnhanced resume saved to:")
        print(f"- Text version: {txt_path}")
        print(f"- PDF version: {pdf_path}")
        
    except Exception as e:
        print(f"\nError: {str(e)}")

if __name__ == "__main__":
    main()