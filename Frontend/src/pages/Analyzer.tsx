
import { useState, useRef } from "react";
import { analyzeResume } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Upload, FileUp, CheckCircle, AlertTriangle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DomainSelector from "@/components/DomainSelector";
import AnalysisResult from "@/components/AnalysisResult";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  resumeText: z.string().optional(), // Job description is optional if using domain
  domain: z.string().optional(), // Domain is optional if using job description
});

type FormValues = z.infer<typeof formSchema>;

const Analyzer = () => {
  const [domain, setDomain] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resumeText: "",
      domain: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsAnalyzing(true);
    
    try {
      // We need a resume file and a job description
      if (!resumeFile) {
        toast({
          title: "No resume file",
          description: "Please upload a resume file before submitting.",
          variant: "destructive",
        });
        setIsAnalyzing(false);
        return;
      }

      // For job description: prioritize what's in the domain field if available,
      // otherwise use what's in the resumeText field
      let jobDescription = "";
      
      if (data.domain && data.domain.trim().length > 0) {
        // If domain is specified, use it as job description
        jobDescription = data.domain;
      } else if (data.resumeText && data.resumeText.trim().length > 0) {
        // Otherwise use the text in the resumeText field as job description
        jobDescription = data.resumeText;
      }
      
      if (!jobDescription) {
        toast({
          title: "No job description",
          description: "Please enter a job description in either field.",
          variant: "destructive",
        });
        setIsAnalyzing(false);
        return;
      }

      console.log('Submitting analysis with:', {
        resumeFile: resumeFile.name,
        jobDescriptionLength: jobDescription.length
      });

      // Call the backend API - use the uploaded file and the job description text
      const response = await analyzeResume(resumeFile, jobDescription);
      
      // Parse the API response to match our frontend structure
      const analysisText = response.result;
      
      // Parse scores from the analysis text
      const atsScoreMatch = analysisText.match(/ATS Compatibility Score: (\d+)\/100/);
      const jobMatchMatch = analysisText.match(/Job Match Score: (\d+)\/100/);
      const selectionMatch = analysisText.match(/Selection Probability: (\d+)%/);
      
      // Extract strengths and improvements
      const strengths: {text: string, type: "strength"}[] = [];
      const improvements: {text: string, type: "improvement"}[] = [];
      
      // Extract keywords
      const keywordsMatch = analysisText.match(/Missing Keywords: ([^\n]+)/);
      const keywords = keywordsMatch ? 
        keywordsMatch[1].split(',').map(k => k.trim()) : 
        [];
      
      // Look for strengths section
      if (analysisText.includes('Strengths Highlight:')) {
        const strengthsSection = analysisText.split('Strengths Highlight:')[1].split('\n\n')[0];
        const strengthPoints = strengthsSection.split('- ').filter(s => s.trim().length > 0);
        
        strengthPoints.forEach(point => {
          if (point.trim().length > 0) {
            strengths.push({
              text: point.trim(),
              type: "strength"
            });
          }
        });
      }
      
      // Look for improvements
      if (analysisText.includes('Job-Specific Suggestions:')) {
        const suggestionsSection = analysisText.split('Job-Specific Suggestions:')[1].split('\n\n')[0];
        const suggestionPoints = suggestionsSection.split('- ').filter(s => s.trim().length > 0);
        
        suggestionPoints.forEach(point => {
          if (point.trim().length > 0) {
            improvements.push({
              text: point.trim(),
              type: "improvement"
            });
          }
        });
      }
      
      // Format the result for our frontend
      const formattedResult = {
        score: atsScoreMatch ? parseInt(atsScoreMatch[1]) : 70,
        domainMatch: jobMatchMatch ? parseInt(jobMatchMatch[1]) : 65,
        keywords: keywords,
        suggestions: [...strengths, ...improvements],
        shortlisted: selectionMatch ? parseInt(selectionMatch[1]) >= 50 : false,
        rawAnalysis: analysisText // Keep the raw analysis for reference
      };
      
      setAnalysisResult(formattedResult);
      toast({
        title: "Analysis complete!",
        description: "Your resume has been analyzed successfully.",
      });
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing your resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDomainChange = (selectedDomain: string) => {
    setDomain(selectedDomain);
    form.setValue("domain", selectedDomain);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if the file is a PDF or DOCX
    const fileType = file.type;
    if (!fileType.includes('pdf') && !fileType.includes('word')) {
      toast({
        title: "Invalid file format",
        description: "Please upload a PDF or Word document.",
        variant: "destructive",
      });
      return;
    }
    
    // Save the file for analysis
    setResumeFile(file);
    
    toast({
      title: "Resume uploaded",
      description: `${file.name} is ready for analysis.`,
    });

    // For convenience, we'll set a sample job description if nothing is entered yet
   
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 container py-8">
        <div className="flex items-center mb-6">
          <FileText className="h-6 w-6 mr-2 text-primary" />
          <h1 className="text-3xl font-bold">Resume Analyzer</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5">
            <Card>
              <CardHeader>
                <CardTitle>Upload Your Resume</CardTitle>
                <CardDescription>
                  Upload your resume or paste the content to analyze it for your target domain.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid w-full max-w-sm items-center gap-1.5 mx-auto mb-6">
                      <label htmlFor="resume-upload" className="cursor-pointer">
                        <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center hover:bg-muted/50 transition-colors">
                          <FileUp className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm font-medium">
                            Click to upload your resume
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Supports PDF, DOCX, or TXT files
                          </p>
                        </div>
                        <input
                          id="resume-upload"
                          type="file"
                          className="hidden"
                          accept=".pdf,.docx,.txt"
                          onChange={handleFileUpload}
                        />
                      </label>
                    </div>

                    <p className="text-center text-sm text-muted-foreground mb-2">Or paste your job description</p>

                    <FormField
                      control={form.control}
                      name="resumeText"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Paste the job description here..." 
                              className="min-h-[300px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Enter the job description to analyze your resume against
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Alternative job description input */}
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-1">Target Domain/Job (Optional)</p>
                      <p className="text-sm text-muted-foreground mb-2">
                        You can alternatively select a pre-defined domain or paste a job description in the field above.
                      </p>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="domain"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <DomainSelector 
                              selectedDomain={domain} 
                              onSelect={handleDomainChange} 
                            />
                          </FormControl>
                          <FormDescription>
                            Selecting a domain will override the job description text above.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full" disabled={isAnalyzing}>
                      {isAnalyzing ? (
                        <>Analyzing Resume...</>
                      ) : (
                        <>Analyze Resume</>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-7">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Analysis Results</CardTitle>
                <CardDescription>
                  Get insights on how well your resume matches your target domain.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {analysisResult ? (
                  <AnalysisResult analysis={analysisResult} domain={domain} />
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Analysis Yet</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Upload your resume and select a domain to see AI-powered analysis and improvement suggestions.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Analyzer;


// import { useState } from "react";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import * as z from "zod";
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Textarea } from "@/components/ui/textarea";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// import { FileText, Upload, FileUp, CheckCircle, AlertTriangle, TrendingUp, Target, Lightbulb, Award } from "lucide-react";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
// import DomainSelector from "@/components/DomainSelector";
// import { useToast } from "@/hooks/use-toast";

// const formSchema = z.object({
//   resumeText: z.string().min(50, "Resume content must be at least 50 characters long"),
//   domain: z.string().min(1, "Please select a domain"),
// });

// type FormValues = z.infer<typeof formSchema>;

// // Mock in-memory database for analysis results
// const MOCK_ANALYSIS_DB = {
//   "web-development": {
//     overallScore: 78,
//     domainMatch: 85,
//     atsScore: 72,
//     keywordMatch: 68,
//     experienceRelevance: 82,
//     skillsAlignment: 90,
//     matchedKeywords: ["React", "JavaScript", "Node.js", "HTML", "CSS", "REST API", "Git", "Frontend", "Web Development"],
//     missingKeywords: ["TypeScript", "Redux", "Jest", "Docker", "AWS", "GraphQL", "Webpack", "SASS"],
//     strengths: [
//       "Strong technical skills in modern web technologies",
//       "Relevant work experience in frontend development",
//       "Good project portfolio demonstrating practical skills",
//       "Clear progression in career responsibilities",
//       "Solid educational background in Computer Applications"
//     ],
//     improvements: [
//       "Add TypeScript experience to match current industry standards",
//       "Include testing frameworks like Jest or Cypress",
//       "Mention cloud platforms experience (AWS, Azure, or GCP)",
//       "Add metrics to quantify your achievements (e.g., '20% performance improvement')",
//       "Include more details about agile methodologies and team collaboration"
//     ],
//     suggestedChanges: [
//       {
//         section: "Skills",
//         original: "JavaScript, React.js, Node.js",
//         suggested: "JavaScript, TypeScript, React.js, Redux, Node.js, Express.js",
//         reason: "Adding TypeScript and Redux shows modern development practices"
//       },
//       {
//         section: "Experience",
//         original: "Developed and maintained responsive web applications",
//         suggested: "Developed and maintained 15+ responsive web applications, improving user engagement by 25%",
//         reason: "Quantified achievements with specific numbers and impact"
//       },
//       {
//         section: "Skills",
//         original: "Python (basic)",
//         suggested: "Python, Jest/Cypress (Testing), Docker (Containerization)",
//         reason: "Replace basic Python with more relevant web development tools"
//       }
//     ],
//     shortlisted: true,
//     recommendations: [
//       "Focus on adding cloud deployment experience",
//       "Consider getting certifications in React or AWS",
//       "Build a project using microservices architecture",
//       "Contribute to open-source projects to show collaboration skills"
//     ]
//   },
//   "data-science": {
//     overallScore: 45,
//     domainMatch: 32,
//     atsScore: 58,
//     keywordMatch: 28,
//     experienceRelevance: 25,
//     skillsAlignment: 40,
//     matchedKeywords: ["Python", "API", "Database", "Analytics"],
//     missingKeywords: ["Machine Learning", "TensorFlow", "Pandas", "NumPy", "Scikit-learn", "SQL", "Statistics", "R", "Jupyter"],
//     strengths: [
//       "Basic Python knowledge provides foundation",
//       "Database experience is transferable",
//       "Strong analytical thinking from development background",
//       "Good educational foundation in technology"
//     ],
//     improvements: [
//       "Gain hands-on experience with ML libraries (Pandas, NumPy, Scikit-learn)",
//       "Learn statistical analysis and data visualization tools",
//       "Build portfolio projects with real datasets",
//       "Consider additional education in statistics or data science",
//       "Gain experience with SQL and database querying"
//     ],
//     suggestedChanges: [
//       {
//         section: "Skills",
//         original: "Python (basic)",
//         suggested: "Python, Pandas, NumPy, Scikit-learn, SQL, Data Visualization",
//         reason: "Essential data science tools and libraries"
//       },
//       {
//         section: "Projects",
//         original: "E-commerce Website",
//         suggested: "Data Analysis Project - Customer Behavior Analysis using Python and Pandas",
//         reason: "More relevant project for data science roles"
//       },
//       {
//         section: "Education",
//         original: "Relevant coursework: Web Development, Database Management",
//         suggested: "Relevant coursework: Statistics, Database Management, Data Structures, Machine Learning Fundamentals",
//         reason: "Highlight math and statistics background"
//       }
//     ],
//     shortlisted: false,
//     recommendations: [
//       "Complete online courses in data science (Coursera, edX)",
//       "Build 2-3 data science projects for your portfolio",
//       "Learn SQL and practice with real datasets",
//       "Consider pursuing additional certification in data analytics"
//     ]
//   }
// };

// const Analyzer = () => {
//   const [domain, setDomain] = useState("");
//   const [isAnalyzing, setIsAnalyzing] = useState(false);
//   const [analysisResult, setAnalysisResult] = useState<any>(null);
//   const { toast } = useToast();

//   const form = useForm<FormValues>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       resumeText: "",
//       domain: "",
//     },
//   });

//   const onSubmit = async (data: FormValues) => {
//     setIsAnalyzing(true);
    
//     try {
//       // Simulate API call delay
//       await new Promise(resolve => setTimeout(resolve, 2000));
      
//       // Get analysis result from mock database based on selected domain
//       const mockResult = MOCK_ANALYSIS_DB[data.domain as keyof typeof MOCK_ANALYSIS_DB] || MOCK_ANALYSIS_DB["web-development"];
      
//       setAnalysisResult(mockResult);
//       toast({
//         title: "Analysis complete!",
//         description: "Your resume has been analyzed successfully.",
//       });
//     } catch (error) {
//       toast({
//         title: "Analysis failed",
//         description: "There was an error analyzing your resume. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsAnalyzing(false);
//     }
//   };

//   const handleDomainChange = (selectedDomain: string) => {
//     setDomain(selectedDomain);
//     form.setValue("domain", selectedDomain);
//   };

//   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     toast({
//       title: "File uploaded",
//       description: "File content would be extracted in a real application.",
//     });

//     // Mock resume text
//     const mockResumeText = `JOHN DOE
// johndoe@example.com | (555) 123-4567 | New York, NY | linkedin.com/in/johndoe

// PROFESSIONAL SUMMARY
// Dedicated web developer with 3+ years of experience in building responsive websites and applications. Proficient in React, JavaScript, and Node.js. Strong problem-solving skills and ability to work in fast-paced environments.

// WORK EXPERIENCE
// Frontend Developer
// Tech Solutions Inc. | Jan 2022 - Present
// - Developed and maintained responsive web applications using React.js
// - Implemented new features and optimized existing code for better performance
// - Collaborated with UX/UI designers to implement visually appealing interfaces
// - Integrated REST APIs and third-party services

// Junior Web Developer
// Digital Creations | June 2020 - Dec 2021
// - Assisted in developing and maintaining client websites
// - Created responsive layouts using HTML, CSS, and JavaScript
// - Fixed bugs and improved website functionality

// EDUCATION
// Bachelor of Computer Applications
// University of Technology | 2017 - 2020
// - GPA: 3.8/4.0
// - Relevant coursework: Web Development, Database Management, Data Structures

// SKILLS
// - JavaScript, React.js, Node.js
// - HTML5, CSS3, Tailwind CSS
// - Git, GitHub
// - RESTful APIs
// - Python (basic)
// - UI/UX principles

// PROJECTS
// E-commerce Website
// - Built a full-stack e-commerce platform with user authentication, product management
// - Technologies: React, Node.js, MongoDB, Express

// Personal Portfolio
// - Designed and developed a responsive portfolio website
// - Technologies: HTML, CSS, JavaScript`;

//     form.setValue("resumeText", mockResumeText);
//   };

//   const getScoreColor = (score: number) => {
//     if (score >= 80) return "text-green-600";
//     if (score >= 60) return "text-yellow-600";
//     return "text-red-600";
//   };

//   const getScoreBgColor = (score: number) => {
//     if (score >= 80) return "bg-green-100";
//     if (score >= 60) return "bg-yellow-100";
//     return "bg-red-100";
//   };

//   return (
//     <div className="flex flex-col min-h-screen">
//       <Navbar />

//       <main className="flex-1 container py-8">
//         <div className="flex items-center mb-6">
//           <FileText className="h-6 w-6 mr-2 text-primary" />
//           <h1 className="text-3xl font-bold">Resume Analyzer</h1>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
//           <div className="lg:col-span-5">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Upload Your Resume</CardTitle>
//                 <CardDescription>
//                   Upload your resume or paste the content to analyze it for your target domain.
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <Form {...form}>
//                   <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//                     <div className="grid w-full max-w-sm items-center gap-1.5 mx-auto mb-6">
//                       <label htmlFor="resume-upload" className="cursor-pointer">
//                         <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center hover:bg-muted/50 transition-colors">
//                           <FileUp className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
//                           <p className="text-sm font-medium">
//                             Click to upload your resume
//                           </p>
//                           <p className="text-xs text-muted-foreground mt-1">
//                             Supports PDF, DOCX, or TXT files
//                           </p>
//                         </div>
//                         <input
//                           id="resume-upload"
//                           type="file"
//                           className="hidden"
//                           accept=".pdf,.docx,.txt"
//                           onChange={handleFileUpload}
//                         />
//                       </label>
//                     </div>

//                     <p className="text-center text-sm text-muted-foreground mb-2">Or paste your resume content</p>

//                     <FormField
//                       control={form.control}
//                       name="resumeText"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormControl>
//                             <Textarea 
//                               placeholder="Paste your resume content here..." 
//                               className="min-h-[300px]"
//                               {...field} 
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       control={form.control}
//                       name="domain"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Target Domain</FormLabel>
//                           <FormControl>
//                             <DomainSelector 
//                               selectedDomain={domain} 
//                               onSelect={handleDomainChange} 
//                             />
//                           </FormControl>
//                           <FormDescription>
//                             Select the domain you're targeting for your job application.
//                           </FormDescription>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     <Button type="submit" className="w-full" disabled={isAnalyzing}>
//                       {isAnalyzing ? (
//                         <>Analyzing Resume...</>
//                       ) : (
//                         <>Analyze Resume</>
//                       )}
//                     </Button>
//                   </form>
//                 </Form>
//               </CardContent>
//             </Card>
//           </div>

//           <div className="lg:col-span-7">
//             <Card className="h-full">
//               <CardHeader>
//                 <CardTitle>Analysis Results</CardTitle>
//                 <CardDescription>
//                   Get insights on how well your resume matches your target domain.
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 {analysisResult ? (
//                   <div className="space-y-6">
//                     {/* Overall Score and Shortlist Status */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div className="p-4 border rounded-lg bg-green-50">
//                         <div className="flex items-center justify-between">
//                           <div>
//                             <p className="text-sm font-medium text-gray-600">Overall Score</p>
//                             <p className="text-2xl font-bold text-green-600">
//                               {analysisResult.overallScore}%
//                             </p>
//                           </div>
//                           <Award className="h-8 w-8 text-green-600" />
//                         </div>
//                       </div>
                      
//                       <div className={`p-4 border rounded-lg ${analysisResult.shortlisted ? 'bg-green-50' : 'bg-red-50'}`}>
//                         <div className="flex items-center justify-between">
//                           <div>
//                             <p className="text-sm font-medium text-gray-600">Shortlist Status</p>
//                             <p className={`text-lg font-semibold ${analysisResult.shortlisted ? 'text-green-600' : 'text-red-600'}`}>
//                               {analysisResult.shortlisted ? 'Likely Shortlisted' : 'Needs Improvement'}
//                             </p>
//                           </div>
//                           {analysisResult.shortlisted ? (
//                             <CheckCircle className="h-8 w-8 text-green-600" />
//                           ) : (
//                             <AlertTriangle className="h-8 w-8 text-red-600" />
//                           )}
//                         </div>
//                       </div>
//                     </div>

//                     {/* Detailed Scores */}
//                     <div className="p-4 border rounded-lg">
//                       <h3 className="text-lg font-semibold mb-4 flex items-center">
//                         <Target className="h-5 w-5 mr-2" />
//                         Detailed Analysis
//                       </h3>
//                       <div className="space-y-4">
//                         <div>
//                           <div className="flex justify-between text-sm mb-2">
//                             <span>Domain Match</span>
//                             <span className="font-medium">{analysisResult.domainMatch}%</span>
//                           </div>
//                           <div className="w-full bg-gray-200 rounded-full h-2">
//                             <div 
//                               className="bg-blue-600 h-2 rounded-full" 
//                               style={{ width: `${analysisResult.domainMatch}%` }}
//                             ></div>
//                           </div>
//                         </div>
//                         <div>
//                           <div className="flex justify-between text-sm mb-2">
//                             <span>ATS Compatibility</span>
//                             <span className="font-medium">{analysisResult.atsScore}%</span>
//                           </div>
//                           <div className="w-full bg-gray-200 rounded-full h-2">
//                             <div 
//                               className="bg-blue-600 h-2 rounded-full" 
//                               style={{ width: `${analysisResult.atsScore}%` }}
//                             ></div>
//                           </div>
//                         </div>
//                         <div>
//                           <div className="flex justify-between text-sm mb-2">
//                             <span>Keyword Match</span>
//                             <span className="font-medium">{analysisResult.keywordMatch}%</span>
//                           </div>
//                           <div className="w-full bg-gray-200 rounded-full h-2">
//                             <div 
//                               className="bg-blue-600 h-2 rounded-full" 
//                               style={{ width: `${analysisResult.keywordMatch}%` }}
//                             ></div>
//                           </div>
//                         </div>
//                         <div>
//                           <div className="flex justify-between text-sm mb-2">
//                             <span>Experience Relevance</span>
//                             <span className="font-medium">{analysisResult.experienceRelevance}%</span>
//                           </div>
//                           <div className="w-full bg-gray-200 rounded-full h-2">
//                             <div 
//                               className="bg-blue-600 h-2 rounded-full" 
//                               style={{ width: `${analysisResult.experienceRelevance}%` }}
//                             ></div>
//                           </div>
//                         </div>
//                         <div>
//                           <div className="flex justify-between text-sm mb-2">
//                             <span>Skills Alignment</span>
//                             <span className="font-medium">{analysisResult.skillsAlignment}%</span>
//                           </div>
//                           <div className="w-full bg-gray-200 rounded-full h-2">
//                             <div 
//                               className="bg-blue-600 h-2 rounded-full" 
//                               style={{ width: `${analysisResult.skillsAlignment}%` }}
//                             ></div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Keywords Analysis */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div className="p-4 border rounded-lg">
//                         <h3 className="text-lg font-semibold mb-3 text-green-600">Matched Keywords</h3>
//                         <div className="flex flex-wrap gap-2">
//                           {analysisResult.matchedKeywords.map((keyword: string, index: number) => (
//                             <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-sm">
//                               {keyword}
//                             </span>
//                           ))}
//                         </div>
//                       </div>
                      
//                       <div className="p-4 border rounded-lg">
//                         <h3 className="text-lg font-semibold mb-3 text-red-600">Missing Keywords</h3>
//                         <div className="flex flex-wrap gap-2">
//                           {analysisResult.missingKeywords.map((keyword: string, index: number) => (
//                             <span key={index} className="px-2 py-1 border border-red-200 text-red-600 rounded-md text-sm">
//                               {keyword}
//                             </span>
//                           ))}
//                         </div>
//                       </div>
//                     </div>

//                     {/* Strengths and Improvements */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div className="p-4 border rounded-lg">
//                         <h3 className="text-lg font-semibold mb-3 flex items-center text-green-600">
//                           <CheckCircle className="h-5 w-5 mr-2" />
//                           Strengths
//                         </h3>
//                         <ul className="space-y-2">
//                           {analysisResult.strengths.map((strength: string, index: number) => (
//                             <li key={index} className="text-sm text-gray-600 flex items-start">
//                               <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
//                               {strength}
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
                      
//                       <div className="p-4 border rounded-lg">
//                         <h3 className="text-lg font-semibold mb-3 flex items-center text-orange-600">
//                           <TrendingUp className="h-5 w-5 mr-2" />
//                           Areas for Improvement
//                         </h3>
//                         <ul className="space-y-2">
//                           {analysisResult.improvements.map((improvement: string, index: number) => (
//                             <li key={index} className="text-sm text-gray-600 flex items-start">
//                               <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
//                               {improvement}
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     </div>

//                     {/* Suggested Changes */}
//                     <div className="p-4 border rounded-lg">
//                       <h3 className="text-lg font-semibold mb-4 flex items-center">
//                         <Lightbulb className="h-5 w-5 mr-2 text-blue-600" />
//                         Suggested Changes
//                       </h3>
//                       <div className="space-y-4">
//                         {analysisResult.suggestedChanges.map((change: any, index: number) => (
//                           <div key={index} className="border rounded-lg p-4 bg-blue-50">
//                             <div className="flex items-center mb-2">
//                               <span className="px-2 py-1 border border-gray-300 rounded text-xs mr-2">{change.section}</span>
//                             </div>
//                             <div className="space-y-2 text-sm">
//                               <div>
//                                 <span className="font-medium text-red-600">Before: </span>
//                                 <span className="text-gray-600">{change.original}</span>
//                               </div>
//                               <div>
//                                 <span className="font-medium text-green-600">After: </span>
//                                 <span className="text-gray-600">{change.suggested}</span>
//                               </div>
//                               <div>
//                                 <span className="font-medium text-blue-600">Why: </span>
//                                 <span className="text-gray-600">{change.reason}</span>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     {/* Recommendations */}
//                     <Card className="p-4">
//                       <h3 className="text-lg font-semibold mb-3 text-purple-600">Next Steps & Recommendations</h3>
//                       <ul className="space-y-2">
//                         {analysisResult.recommendations.map((recommendation: string, index: number) => (
//                           <li key={index} className="text-sm text-muted-foreground flex items-start">
//                             <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
//                             {recommendation}
//                           </li>
//                         ))}
//                       </ul>
//                     </Card>
//                   </div>
//                 ) : (
//                   <div className="text-center py-12">
//                     <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
//                     <h3 className="text-lg font-medium mb-2">No Analysis Yet</h3>
//                     <p className="text-muted-foreground max-w-md mx-auto">
//                       Upload your resume and select a domain to see AI-powered analysis and improvement suggestions.
//                     </p>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </main>

//       <Footer />
//     </div>
//   );
// };

// export default Analyzer;