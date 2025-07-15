// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
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
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Separator } from "@/components/ui/separator";
// import { FileText, CheckCircle, User, Building, Book, Award, Briefcase } from "lucide-react";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
// import ResumeFormSection, { SectionItem } from "@/components/ResumeFormSection";
// import DomainSelector from "@/components/DomainSelector";
// import { useToast } from "@/hooks/use-toast";

// const personalInfoSchema = z.object({
//   fullName: z.string().min(2, "Full name must be at least 2 characters"),
//   email: z.string().email("Invalid email address"),
//   phone: z.string().min(10, "Phone number must be at least 10 characters"),
//   location: z.string().min(2, "Location must be at least 2 characters"),
//   summary: z.string().min(10, "Summary must be at least 10 characters").max(500, "Summary must be less than 500 characters"),
// });

// const educationSchema = z.object({
//   education: z.array(
//     z.object({
//       degree: z.string().min(2, "Degree must be at least 2 characters"),
//       institution: z.string().min(2, "Institution must be at least 2 characters"),
//       location: z.string().optional(),
//       startDate: z.string().min(4, "Start date must be at least 4 characters"),
//       endDate: z.string().min(4, "End date must be at least 4 characters"),
//       description: z.string().optional(),
//     })
//   ).default([]),
// });

// const experienceSchema = z.object({
//   experience: z.array(
//     z.object({
//       title: z.string().min(2, "Job title must be at least 2 characters"),
//       company: z.string().min(2, "Company must be at least 2 characters"),
//       location: z.string().optional(),
//       startDate: z.string().min(4, "Start date must be at least 4 characters"),
//       endDate: z.string().min(4, "End date must be at least 4 characters"),
//       description: z.string().min(10, "Description must be at least 10 characters"),
//     })
//   ).default([]),
// });

// const skillsSchema = z.object({
//   skills: z.array(
//     z.object({
//       name: z.string().min(2, "Skill name must be at least 2 characters"),
//       level: z.string().optional(),
//     })
//   ).default([]),
// });

// const projectsSchema = z.object({
//   projects: z.array(
//     z.object({
//       name: z.string().min(2, "Project name must be at least 2 characters"),
//       description: z.string().min(10, "Description must be at least 10 characters"),
//       technologies: z.string().optional(),
//       link: z.string().url("Invalid URL").optional().or(z.literal("")),
//     })
//   ).default([]),
// });

// const formSchema = z.object({
//   ...personalInfoSchema.shape,
//   ...educationSchema.shape,
//   ...experienceSchema.shape,
//   ...skillsSchema.shape,
//   ...projectsSchema.shape,
//   domain: z.string().min(1, "Please select a domain"),
// });

// type FormValues = z.infer<typeof formSchema>;

// const Builder = () => {
//   const [activeTab, setActiveTab] = useState("personal");
//   const [domain, setDomain] = useState("");
//   const { toast } = useToast();

//   const form = useForm<FormValues>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       fullName: "",
//       email: "",
//       phone: "",
//       location: "",
//       summary: "",
//       education: [{ degree: "", institution: "", location: "", startDate: "", endDate: "", description: "" }],
//       experience: [{ title: "", company: "", location: "", startDate: "", endDate: "", description: "" }],
//       skills: [{ name: "", level: "" }],
//       projects: [{ name: "", description: "", technologies: "", link: "" }],
//       domain: "",
//     },
//   });

//   const onSubmit = (data: FormValues) => {
//     console.log("Form submitted:", data);
//     toast({
//       title: "Resume created!",
//       description: "Your resume has been successfully created.",
//     });
//     // In a real application, we would:
//     // 1. Send the data to the backend for processing
//     // 2. Generate the resume document
//     // 3. Analyze the resume for the selected domain
//     // 4. Redirect to the results page
//   };

//   // Helper functions for managing form arrays
//   const addEducation = () => {
//     const education = form.getValues("education");
//     form.setValue("education", [
//       ...education,
//       { degree: "", institution: "", location: "", startDate: "", endDate: "", description: "" },
//     ]);
//   };

//   const removeEducation = (index: number) => {
//     const education = form.getValues("education");
//     form.setValue("education", education.filter((_, i) => i !== index));
//   };

//   const addExperience = () => {
//     const experience = form.getValues("experience");
//     form.setValue("experience", [
//       ...experience,
//       { title: "", company: "", location: "", startDate: "", endDate: "", description: "" },
//     ]);
//   };

//   const removeExperience = (index: number) => {
//     const experience = form.getValues("experience");
//     form.setValue("experience", experience.filter((_, i) => i !== index));
//   };

//   const addSkill = () => {
//     const skills = form.getValues("skills");
//     form.setValue("skills", [...skills, { name: "", level: "" }]);
//   };

//   const removeSkill = (index: number) => {
//     const skills = form.getValues("skills");
//     form.setValue("skills", skills.filter((_, i) => i !== index));
//   };

//   const addProject = () => {
//     const projects = form.getValues("projects");
//     form.setValue("projects", [...projects, { name: "", description: "", technologies: "", link: "" }]);
//   };

//   const removeProject = (index: number) => {
//     const projects = form.getValues("projects");
//     form.setValue("projects", projects.filter((_, i) => i !== index));
//   };

//   const handleDomainChange = (selectedDomain: string) => {
//     setDomain(selectedDomain);
//     form.setValue("domain", selectedDomain);
//   };

//   return (
//     <div className="flex flex-col min-h-screen">
//       <Navbar />

//       <main className="flex-1 container py-8">
//         <div className="flex items-center mb-6">
//           <FileText className="h-6 w-6 mr-2 text-primary" />
//           <h1 className="text-3xl font-bold">Resume Builder</h1>
//         </div>

//         <p className="text-muted-foreground mb-8">
//           Fill in the details below to create your professional resume. Navigate through different sections using the tabs.
//         </p>

//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//             <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//               <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8">
//                 <TabsTrigger value="personal" className="flex items-center gap-2">
//                   <User className="h-4 w-4" />
//                   <span className="hidden md:inline">Personal</span>
//                 </TabsTrigger>
//                 <TabsTrigger value="education" className="flex items-center gap-2">
//                   <Book className="h-4 w-4" />
//                   <span className="hidden md:inline">Education</span>
//                 </TabsTrigger>
//                 <TabsTrigger value="experience" className="flex items-center gap-2">
//                   <Briefcase className="h-4 w-4" />
//                   <span className="hidden md:inline">Experience</span>
//                 </TabsTrigger>
//                 <TabsTrigger value="skills" className="flex items-center gap-2">
//                   <CheckCircle className="h-4 w-4" />
//                   <span className="hidden md:inline">Skills</span>
//                 </TabsTrigger>
//                 <TabsTrigger value="projects" className="flex items-center gap-2">
//                   <Award className="h-4 w-4" />
//                   <span className="hidden md:inline">Projects</span>
//                 </TabsTrigger>
//               </TabsList>

//               <TabsContent value="personal" className="space-y-6 animate-slide-up">
//                 <ResumeFormSection title="Personal Information" description="Your basic contact details and professional summary">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <FormField
//                       control={form.control}
//                       name="fullName"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Full Name</FormLabel>
//                           <FormControl>
//                             <Input placeholder="John Doe" {...field} />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                     <FormField
//                       control={form.control}
//                       name="email"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Email</FormLabel>
//                           <FormControl>
//                             <Input placeholder="johndoe@example.com" {...field} />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                     <FormField
//                       control={form.control}
//                       name="phone"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Phone Number</FormLabel>
//                           <FormControl>
//                             <Input placeholder="+1 (555) 123-4567" {...field} />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                     <FormField
//                       control={form.control}
//                       name="location"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Location</FormLabel>
//                           <FormControl>
//                             <Input placeholder="New York, NY" {...field} />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                   <FormField
//                     control={form.control}
//                     name="summary"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Professional Summary</FormLabel>
//                         <FormControl>
//                           <Textarea
//                             placeholder="Experienced software developer with 5+ years of experience in web development..."
//                             className="min-h-[100px]"
//                             {...field}
//                           />
//                         </FormControl>
//                         <FormDescription>
//                           A brief overview of your professional background, skills, and career goals.
//                         </FormDescription>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                   <FormField
//                     control={form.control}
//                     name="domain"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Target Domain</FormLabel>
//                         <FormControl>
//                           <DomainSelector
//                             selectedDomain={domain}
//                             onSelect={handleDomainChange}
//                           />
//                         </FormControl>
//                         <FormDescription>
//                           Select the industry or domain you're targeting for better resume optimization.
//                         </FormDescription>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </ResumeFormSection>
//                 <div className="flex justify-end">
//                   <Button type="button" onClick={() => setActiveTab("education")}>
//                     Next: Education
//                   </Button>
//                 </div>
//               </TabsContent>

//               <TabsContent value="education" className="animate-slide-up">
//                 <ResumeFormSection
//                   title="Education"
//                   description="Your academic background and qualifications"
//                   onAdd={addEducation}
//                   addButtonText="Add Education"
//                 >
//                   {form.getValues("education").map((_, index) => (
//                     <SectionItem
//                       key={index}
//                       onRemove={form.getValues("education").length > 1 ? () => removeEducation(index) : undefined}
//                     >
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <FormField
//                           control={form.control}
//                           name={`education.${index}.degree`}
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>Degree/Certification</FormLabel>
//                               <FormControl>
//                                 <Input placeholder="Bachelor of Computer Applications" {...field} />
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />
//                         <FormField
//                           control={form.control}
//                           name={`education.${index}.institution`}
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>Institution</FormLabel>
//                               <FormControl>
//                                 <Input placeholder="University of Technology" {...field} />
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />
//                         <FormField
//                           control={form.control}
//                           name={`education.${index}.location`}
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>Location (Optional)</FormLabel>
//                               <FormControl>
//                                 <Input placeholder="New Delhi, India" {...field} />
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />
//                         <div className="grid grid-cols-2 gap-4">
//                           <FormField
//                             control={form.control}
//                             name={`education.${index}.startDate`}
//                             render={({ field }) => (
//                               <FormItem>
//                                 <FormLabel>Start Date</FormLabel>
//                                 <FormControl>
//                                   <Input placeholder="2020" {...field} />
//                                 </FormControl>
//                                 <FormMessage />
//                               </FormItem>
//                             )}
//                           />
//                           <FormField
//                             control={form.control}
//                             name={`education.${index}.endDate`}
//                             render={({ field }) => (
//                               <FormItem>
//                                 <FormLabel>End Date</FormLabel>
//                                 <FormControl>
//                                   <Input placeholder="2023" {...field} />
//                                 </FormControl>
//                                 <FormMessage />
//                               </FormItem>
//                             )}
//                           />
//                         </div>
//                       </div>
//                       <FormField
//                         control={form.control}
//                         name={`education.${index}.description`}
//                         render={({ field }) => (
//                           <FormItem className="mt-4">
//                             <FormLabel>Description (Optional)</FormLabel>
//                             <FormControl>
//                               <Textarea
//                                 placeholder="Relevant coursework, achievements, or projects..."
//                                 className="min-h-[80px]"
//                                 {...field}
//                               />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                     </SectionItem>
//                   ))}
//                 </ResumeFormSection>
//                 <div className="flex justify-between">
//                   <Button type="button" variant="outline" onClick={() => setActiveTab("personal")}>
//                     Previous: Personal
//                   </Button>
//                   <Button type="button" onClick={() => setActiveTab("experience")}>
//                     Next: Experience
//                   </Button>
//                 </div>
//               </TabsContent>

//               <TabsContent value="experience" className="animate-slide-up">
//                 <ResumeFormSection
//                   title="Work Experience"
//                   description="Your professional experience and roles"
//                   onAdd={addExperience}
//                   addButtonText="Add Experience"
//                 >
//                   {form.getValues("experience").map((_, index) => (
//                     <SectionItem
//                       key={index}
//                       onRemove={form.getValues("experience").length > 1 ? () => removeExperience(index) : undefined}
//                     >
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <FormField
//                           control={form.control}
//                           name={`experience.${index}.title`}
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>Job Title</FormLabel>
//                               <FormControl>
//                                 <Input placeholder="Software Developer" {...field} />
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />
//                         <FormField
//                           control={form.control}
//                           name={`experience.${index}.company`}
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>Company</FormLabel>
//                               <FormControl>
//                                 <Input placeholder="Tech Solutions Inc." {...field} />
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />
//                         <FormField
//                           control={form.control}
//                           name={`experience.${index}.location`}
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>Location (Optional)</FormLabel>
//                               <FormControl>
//                                 <Input placeholder="Bangalore, India" {...field} />
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />
//                         <div className="grid grid-cols-2 gap-4">
//                           <FormField
//                             control={form.control}
//                             name={`experience.${index}.startDate`}
//                             render={({ field }) => (
//                               <FormItem>
//                                 <FormLabel>Start Date</FormLabel>
//                                 <FormControl>
//                                   <Input placeholder="Jan 2021" {...field} />
//                                 </FormControl>
//                                 <FormMessage />
//                               </FormItem>
//                             )}
//                           />
//                           <FormField
//                             control={form.control}
//                             name={`experience.${index}.endDate`}
//                             render={({ field }) => (
//                               <FormItem>
//                                 <FormLabel>End Date</FormLabel>
//                                 <FormControl>
//                                   <Input placeholder="Present" {...field} />
//                                 </FormControl>
//                                 <FormMessage />
//                               </FormItem>
//                             )}
//                           />
//                         </div>
//                       </div>
//                       <FormField
//                         control={form.control}
//                         name={`experience.${index}.description`}
//                         render={({ field }) => (
//                           <FormItem className="mt-4">
//                             <FormLabel>Description</FormLabel>
//                             <FormControl>
//                               <Textarea
//                                 placeholder="Developed and maintained web applications using React and Node.js..."
//                                 className="min-h-[100px]"
//                                 {...field}
//                               />
//                             </FormControl>
//                             <FormDescription>
//                               Describe your responsibilities, achievements, and the technologies you used.
//                             </FormDescription>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                     </SectionItem>
//                   ))}
//                 </ResumeFormSection>
//                 <div className="flex justify-between">
//                   <Button type="button" variant="outline" onClick={() => setActiveTab("education")}>
//                     Previous: Education
//                   </Button>
//                   <Button type="button" onClick={() => setActiveTab("skills")}>
//                     Next: Skills
//                   </Button>
//                 </div>
//               </TabsContent>

//               <TabsContent value="skills" className="animate-slide-up">
//                 <ResumeFormSection
//                   title="Skills"
//                   description="Your technical and soft skills"
//                   onAdd={addSkill}
//                   addButtonText="Add Skill"
//                 >
//                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                     {form.getValues("skills").map((_, index) => (
//                       <SectionItem
//                         key={index}
//                         onRemove={form.getValues("skills").length > 1 ? () => removeSkill(index) : undefined}
//                         className="h-full"
//                       >
//                         <FormField
//                           control={form.control}
//                           name={`skills.${index}.name`}
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>Skill</FormLabel>
//                               <FormControl>
//                                 <Input placeholder="React.js" {...field} />
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />
//                         <FormField
//                           control={form.control}
//                           name={`skills.${index}.level`}
//                           render={({ field }) => (
//                             <FormItem className="mt-2">
//                               <FormLabel>Level (Optional)</FormLabel>
//                               <FormControl>
//                                 <Input placeholder="Advanced" {...field} />
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />
//                       </SectionItem>
//                     ))}
//                   </div>
//                 </ResumeFormSection>
//                 <div className="flex justify-between">
//                   <Button type="button" variant="outline" onClick={() => setActiveTab("experience")}>
//                     Previous: Experience
//                   </Button>
//                   <Button type="button" onClick={() => setActiveTab("projects")}>
//                     Next: Projects
//                   </Button>
//                 </div>
//               </TabsContent>

//               <TabsContent value="projects" className="animate-slide-up">
//                 <ResumeFormSection
//                   title="Projects"
//                   description="Your personal or professional projects"
//                   onAdd={addProject}
//                   addButtonText="Add Project"
//                 >
//                   {form.getValues("projects").map((_, index) => (
//                     <SectionItem
//                       key={index}
//                       onRemove={form.getValues("projects").length > 1 ? () => removeProject(index) : undefined}
//                     >
//                       <FormField
//                         control={form.control}
//                         name={`projects.${index}.name`}
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Project Name</FormLabel>
//                             <FormControl>
//                               <Input placeholder="E-commerce Website" {...field} />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                       <FormField
//                         control={form.control}
//                         name={`projects.${index}.description`}
//                         render={({ field }) => (
//                           <FormItem className="mt-4">
//                             <FormLabel>Description</FormLabel>
//                             <FormControl>
//                               <Textarea
//                                 placeholder="Developed a full-stack e-commerce website with user authentication, product management..."
//                                 className="min-h-[100px]"
//                                 {...field}
//                               />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
//                         <FormField
//                           control={form.control}
//                           name={`projects.${index}.technologies`}
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>Technologies Used (Optional)</FormLabel>
//                               <FormControl>
//                                 <Input placeholder="React, Node.js, MongoDB" {...field} />
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />
//                         <FormField
//                           control={form.control}
//                           name={`projects.${index}.link`}
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>Project Link (Optional)</FormLabel>
//                               <FormControl>
//                                 <Input placeholder="https://github.com/username/project" {...field} />
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />
//                       </div>
//                     </SectionItem>
//                   ))}
//                 </ResumeFormSection>
//                 <div className="flex justify-between">
//                   <Button type="button" variant="outline" onClick={() => setActiveTab("skills")}>
//                     Previous: Skills
//                   </Button>
//                   <Button type="submit">
//                     Create Resume
//                   </Button>
//                 </div>
//               </TabsContent>
//             </Tabs>
//           </form>
//         </Form>
//       </main>

//       <Footer />
//     </div>
//   );
// };

// export default Builder;

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  Upload,
  Sparkles,
  CheckCircle,
  AlertCircle,
  User,
  Building,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom"; // <-- Added for navigation
import { useResumeContext } from "@/lib/ResumeContext"; // <-- Added for navigation

const formSchema = z.object({
  jobDescription: z
    .string()
    .min(50, "Job description must be at least 50 characters")
    .max(5000, "Job description must be less than 5000 characters"),
  resumeFile: z
    .any()
    .refine((file) => file && file.length > 0, "Please upload your resume"),
});

type FormValues = z.infer<typeof formSchema>;

const Navbar = () => (
  <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
    <div className="container mx-auto px-4 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">ResumeAI</span>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost">Features</Button>
          <Button variant="ghost">About</Button>
          <Button>Get Started</Button>
        </div>
      </div>
    </div>
  </nav>
);

const Footer = () => (
  <footer className="border-t bg-muted/50">
    <div className="container mx-auto px-4 py-8">
      <div className="text-center text-sm text-muted-foreground">
        © 2024 ResumeAI. All rights reserved.
      </div>
    </div>
  </footer>
);

const ResumeEnhancer = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setResumeFile, setJobDescription } = useResumeContext();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobDescription: "",
      resumeFile: null,
    },
  });

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (
        file.type === "application/pdf" ||
        file.name.endsWith(".pdf") ||
        file.type.includes("document") ||
        file.name.endsWith(".docx") ||
        file.name.endsWith(".doc")
      ) {
        setUploadedFile(file);
        form.setValue("resumeFile", [file]);
        toast({
          title: "File uploaded successfully!",
          description: `${file.name} has been uploaded.`,
        });
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or Word document.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      setUploadedFile(file);
      form.setValue("resumeFile", files);
      toast({
        title: "File uploaded successfully!",
        description: `${file.name} has been uploaded.`,
      });
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsProcessing(true);

    if (!uploadedFile) {
      toast({
        title: "No resume file",
        description: "Please upload a resume file before submitting.",
        variant: "destructive",
      });
      setIsProcessing(false);
      return;
    }

    if (!data.jobDescription) {
      toast({
        title: "No job description",
        description: "Please enter a job description before submitting.",
        variant: "destructive",
      });
      setIsProcessing(false);
      return;
    }

    // Save data to context for EnhancedResume page
    setResumeFile(uploadedFile);
    setJobDescription(data.jobDescription);

    console.log("Enhancing resume with:", {
      jobDescription: data.jobDescription,
      resumeFile: uploadedFile?.name,
    });

    toast({
      title: "Preparing Enhancement...",
      description: "Redirecting to the enhancement page.",
    });

    setIsProcessing(false);

    // Redirect to EnhancedResume page
    navigate("/enhanced-resume");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 mr-3 text-primary" />
              <h1 className="text-4xl font-bold">AI Resume Enhancer</h1>
            </div>
            <p className="text-xl text-muted-foreground">
              Upload your existing resume and job description to get an
              AI-optimized version
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-primary" />
                <CardTitle className="text-lg">1. Upload Resume</CardTitle>
                <CardDescription>
                  Upload your current resume in PDF or Word format
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="text-center">
                <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
                <CardTitle className="text-lg">
                  2. Add Job Description
                </CardTitle>
                <CardDescription>
                  Paste the job description you're applying for
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="text-center">
                <Sparkles className="h-8 w-8 mx-auto mb-2 text-primary" />
                <CardTitle className="text-lg">
                  3. Get Enhanced Resume
                </CardTitle>
                <CardDescription>
                  Receive an AI-optimized resume tailored to the job
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Upload Your Resume
                  </CardTitle>
                  <CardDescription>
                    Upload your current resume. We support PDF and Word document
                    formats.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="resumeFile"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div
                            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                              dragActive
                                ? "border-primary bg-primary/5"
                                : uploadedFile
                                ? "border-green-500 bg-green-50"
                                : "border-muted-foreground/25 hover:border-primary/50"
                            }`}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                          >
                            {uploadedFile ? (
                              <div className="space-y-2">
                                <CheckCircle className="h-12 w-12 mx-auto text-green-500" />
                                <div className="font-medium text-green-700">
                                  {uploadedFile.name}
                                </div>
                                <div className="text-sm text-green-600">
                                  {(uploadedFile.size / 1024 / 1024).toFixed(2)}{" "}
                                  MB
                                </div>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setUploadedFile(null);
                                    form.setValue("resumeFile", null);
                                  }}
                                >
                                  Remove File
                                </Button>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                                <div>
                                  <div className="font-medium">
                                    Drag and drop your resume here, or{" "}
                                    <label className="text-primary cursor-pointer hover:underline">
                                      browse files
                                      <Input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleFileChange}
                                        className="hidden"
                                      />
                                    </label>
                                  </div>
                                  <div className="text-sm text-muted-foreground mt-1">
                                    Supports PDF, DOC, and DOCX files up to 10MB
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Job Description
                  </CardTitle>
                  <CardDescription>
                    Paste the complete job description for the position you're
                    applying to. The more detailed, the better the optimization.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="jobDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="Paste the job description here...

                            Example:
                              We are looking for a Senior Software Engineer to join our team. The ideal candidate should have:
                              - 5+ years of experience with React.js and Node.js
                              - Strong knowledge of JavaScript, TypeScript, and modern web technologies
                              - Experience with cloud platforms (AWS, Azure, or GCP)
                              - Excellent problem-solving skills and attention to detail
                                ..."
                            className="min-h-[300px] resize-y"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Include job requirements, responsibilities, preferred
                          qualifications, and company information for best
                          results.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <div className="flex justify-center">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isProcessing}
                  className="px-8 py-3 text-lg"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Enhancing Resume...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 mr-2" />
                      Enhance My Resume
                    </>
                  )}
                </Button>
              </div>

              {isProcessing && (
                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-2 text-primary">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      <span className="font-medium">
                        Processing your resume...
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      Our AI is analyzing your resume and the job description to
                      create the perfect match.
                    </div>
                  </CardContent>
                </Card>
              )}
            </form>
          </Form>

          <Separator className="my-12" />

          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
              <div className="space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Upload Resume</h3>
                <p className="text-sm text-muted-foreground">
                  Upload your current resume in PDF or Word format
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Add Job Details</h3>
                <p className="text-sm text-muted-foreground">
                  Paste the job description you want to target
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">AI Enhancement</h3>
                <p className="text-sm text-muted-foreground">
                  Our AI optimizes your resume for the specific job
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Download Result</h3>
                <p className="text-sm text-muted-foreground">
                  Get your enhanced, job-tailored resume
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ResumeEnhancer;
