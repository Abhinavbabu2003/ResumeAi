
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Brain, Code, Server } from "lucide-react";

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 container py-8">
        <div className="flex items-center mb-6">
          <FileText className="h-6 w-6 mr-2 text-primary" />
          <h1 className="text-3xl font-bold">About This Project</h1>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Project Overview</h2>
            <p className="text-lg text-muted-foreground mb-6">
              This AI-powered Resume Builder and Domain Scanner is a final year BCA project that combines web development with machine learning to help job seekers create effective resumes and analyze their suitability for specific domains.
            </p>
          
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <Brain className="h-5 w-5 mr-2 text-primary" />
                    AI Resume Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Uses machine learning algorithms to analyze resumes based on domain-specific requirements and provide actionable feedback.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-primary" />
                    Resume Builder
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Intuitive resume builder with customizable sections and templates optimized for different industries.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <Code className="h-5 w-5 mr-2 text-primary" />
                    Modern Tech Stack
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Built with React, Node.js, and Tailwind CSS for the frontend, with Python and machine learning for the backend analysis.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Technical Architecture</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-medium mb-2">Frontend</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>React:</strong> For building a dynamic and responsive user interface</li>
                  <li><strong>Tailwind CSS:</strong> For styling and responsive design</li>
                  <li><strong>shadcn/ui:</strong> For accessible and customizable UI components</li>
                  <li><strong>React Hook Form:</strong> For form validation and handling</li>
                  <li><strong>React Router:</strong> For client-side routing</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-medium mb-2">Backend (Planned)</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Python:</strong> For backend processing and machine learning</li>
                  <li><strong>Node.js:</strong> For API development</li>
                  <li><strong>Machine Learning:</strong> For resume analysis and domain matching</li>
                  <li><strong>Natural Language Processing:</strong> For text analysis and keyword extraction</li>
                  <li><strong>REST API:</strong> For communication between frontend and backend</li>
                </ul>
              </div>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
            <div className="bg-muted p-6 rounded-lg">
              <ol className="list-decimal pl-6 space-y-4">
                <li className="text-lg">
                  <strong>Resume Building:</strong>
                  <p className="text-muted-foreground mt-1">
                    Users create their resume using our intuitive builder, filling in details about their education, experience, skills, and projects.
                  </p>
                </li>
                <li className="text-lg">
                  <strong>Domain Selection:</strong>
                  <p className="text-muted-foreground mt-1">
                    Users select their target domain or industry from a list of options.
                  </p>
                </li>
                <li className="text-lg">
                  <strong>AI Analysis:</strong>
                  <p className="text-muted-foreground mt-1">
                    Our machine learning algorithm analyzes the resume content against domain-specific requirements and industry standards.
                  </p>
                </li>
                <li className="text-lg">
                  <strong>Feedback Generation:</strong>
                  <p className="text-muted-foreground mt-1">
                    The system provides a detailed analysis with a score, domain match percentage, and specific suggestions for improvement.
                  </p>
                </li>
                <li className="text-lg">
                  <strong>Shortlist Prediction:</strong>
                  <p className="text-muted-foreground mt-1">
                    Based on the analysis, the system predicts whether the resume is likely to be shortlisted for the selected domain.
                  </p>
                </li>
              </ol>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Project Goals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-medium mb-2">For Job Seekers</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Create professional, domain-optimized resumes</li>
                    <li>Understand their resume's strengths and weaknesses</li>
                    <li>Improve their chances of getting shortlisted</li>
                    <li>Save time with templates and guided building</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-medium mb-2">Technical Goals</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Implement machine learning for text analysis</li>
                    <li>Create a responsive, user-friendly interface</li>
                    <li>Develop accurate domain-specific analysis</li>
                    <li>Build a full-stack application with modern technologies</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Future Enhancements</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Resume PDF Export:</strong> Allow users to export their resumes in various formats</li>
              <li><strong>Enhanced ML Models:</strong> Improve the accuracy and specificity of the analysis</li>
              <li><strong>Job Listing Integration:</strong> Match resumes against real job listings</li>
              <li><strong>Interview Preparation:</strong> Suggest potential interview questions based on resume content</li>
              <li><strong>Multiple Resume Versions:</strong> Help users maintain different versions for different domains</li>
            </ul>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
