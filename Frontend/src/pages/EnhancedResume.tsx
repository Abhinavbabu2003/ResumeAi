import React, { useState, useEffect } from 'react'
import { enhanceResume } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { FileUp, FileText, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useResumeContext } from '@/lib/ResumeContext'

const EnhancedResume = () => {
  // Use the shared context
  const { resumeFile, jobDescription, setResumeFile, setJobDescription } = useResumeContext()
  
  const [localResumeFile, setLocalResumeFile] = useState<File | null>(null)
  const [localJobDescription, setLocalJobDescription] = useState('')
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [enhancedResult, setEnhancedResult] = useState<string | null>(null)
  const [autoEnhanceTriggered, setAutoEnhanceTriggered] = useState(false)
  const { toast } = useToast()
  
  // Initialize local state from context
  useEffect(() => {
    if (resumeFile) {
      setLocalResumeFile(resumeFile)
    }
    
    if (jobDescription) {
      setLocalJobDescription(jobDescription)
    }
    
    // Auto-enhance if data is available from context
    if (resumeFile && jobDescription && !autoEnhanceTriggered && !enhancedResult) {
      setAutoEnhanceTriggered(true)
      handleEnhance(resumeFile, jobDescription)
    }
  }, [resumeFile, jobDescription])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check if the file is a PDF or DOCX
    const fileType = file.type
    if (!fileType.includes('pdf') && !fileType.includes('word')) {
      toast({
        title: "Invalid file format",
        description: "Please upload a PDF or Word document.",
        variant: "destructive",
      })
      return
    }
    
    // Update both local state and context
    setLocalResumeFile(file)
    setResumeFile(file)
    
    toast({
      title: "File uploaded",
      description: `${file.name} is ready for enhancement.`,
    })
  }

  // Function to handle enhancement with either local or provided data
  const handleEnhance = async (fileToUse: File | null = null, descriptionToUse: string = '') => {
    // Use provided parameters or fall back to state values
    const file = fileToUse || localResumeFile
    const description = descriptionToUse || localJobDescription
    
    if (!file) {
      toast({
        title: "No resume file",
        description: "Please upload a resume file before submitting.",
        variant: "destructive",
      })
      return
    }

    if (!description) {
      toast({
        title: "Job description required",
        description: "Please enter a job description to tailor your resume.",
        variant: "destructive",
      })
      return
    }

    setIsEnhancing(true)

    try {
      const response = await enhanceResume(file, description)
      setEnhancedResult(response.result)
      toast({
        title: "Enhancement complete!",
        description: "Your resume has been enhanced successfully.",
      })
    } catch (error) {
      toast({
        title: "Enhancement failed",
        description: "There was an error enhancing your resume. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsEnhancing(false)
    }
  }

  const handleCopy = () => {
    if (enhancedResult) {
      navigator.clipboard.writeText(enhancedResult)
      toast({
        title: "Copied to clipboard",
        description: "Enhanced resume content copied to clipboard.",
      })
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-6">Resume Enhancer</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Upload Resume & Job Description</CardTitle>
                <CardDescription>
                  Upload your resume and provide a job description to enhance your resume.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="font-medium">Upload Resume</label>
                  <label className="cursor-pointer block">
                    <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center hover:bg-muted/50 transition-colors">
                      <FileUp className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm font-medium">
                        {localResumeFile ? localResumeFile.name : 'Click to upload your resume'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Supports PDF or DOCX files
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.docx"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
                
                <div className="space-y-2">
                  <label className="font-medium">Job Description</label>
                  <Textarea
                    placeholder="Paste the job description here..."
                    className="min-h-[150px]"
                    value={localJobDescription}
                    onChange={(e) => {
                      setLocalJobDescription(e.target.value)
                      setJobDescription(e.target.value)
                    }}
                  />
                  <p className="text-xs text-muted-foreground">
                    Add the full job description to tailor your resume specifically for this role.
                  </p>
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={() => handleEnhance()}
                  disabled={isEnhancing}
                >
                  {isEnhancing ? 'Enhancing Resume...' : 'Enhance Resume'}
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Enhanced Resume</CardTitle>
                <CardDescription>
                  Your enhanced resume tailored for the job description.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEnhancing ? (
                  <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <div className="text-center">
                      <p className="font-medium">Enhancing your resume...</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Our AI is optimizing your resume for the job description.
                      </p>
                    </div>
                  </div>
                ) : enhancedResult ? (
                  <>
                    <div className="border rounded-md p-4 bg-muted/20 whitespace-pre-wrap max-h-[500px] overflow-y-auto">
                      {enhancedResult}
                    </div>
                    <Button className="w-full" onClick={handleCopy}>
                      Copy to Clipboard
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      Your enhanced resume will appear here after processing.
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
  )
}

export default EnhancedResume