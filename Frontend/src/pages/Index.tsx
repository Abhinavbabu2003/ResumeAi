
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Brain,
  Zap,
  Award,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeatureCard from "@/components/FeatureCard";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 md:py-20 bg-gradient-to-b from-blue-50 to-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                {/* <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  Final Year BCA Project
                </div> */}
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  AI-Powered Resume Builder & Domain Scanner
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Create professional resumes tailored to your specific domain and get AI-powered feedback on your chances of getting shortlisted.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button size="lg" asChild>
                    <Link to="/builder">
                      Build Your Resume <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/analyzer">
                      Analyze Existing Resume
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="mx-auto lg:mx-0 lg:flex lg:justify-center relative">
                <div className="relative w-full max-w-[400px] aspect-square">
                  <div className="absolute inset-0 bg-gradient-to-tr from-resume-primary/20 to-resume-secondary/20 rounded-3xl transform rotate-3"></div>
                  <div className="absolute inset-0 bg-white resume-paper rounded-2xl shadow-lg transform -rotate-2">
                    <div className="p-8 h-full flex flex-col">
                      <div className="w-full h-6 bg-resume-primary/10 rounded mb-4"></div>
                      <div className="w-3/4 h-6 bg-resume-primary/10 rounded mb-8"></div>
                      <div className="space-y-4 flex-1">
                        <div className="w-full h-4 bg-muted rounded"></div>
                        <div className="w-full h-4 bg-muted rounded"></div>
                        <div className="w-full h-4 bg-muted rounded"></div>
                        <div className="w-3/4 h-4 bg-muted rounded"></div>
                      </div>
                      <div className="flex justify-end mt-4">
                        <CheckCircle className="w-10 h-10 text-resume-primary" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-12 md:py-20">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Powerful Features
              </h2>
              <p className="max-w-[700px] mx-auto text-muted-foreground">
                Create, analyze, and optimize your resume with our intelligent tools.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={FileText}
                title="Domain-Specific Templates"
                description="Choose from professionally designed templates optimized for different industries and roles."
              />
              <FeatureCard
                icon={Brain}
                title="AI Analysis"
                description="Get intelligent feedback on your resume with machine learning algorithms trained on successful resumes."
              />
              <FeatureCard
                icon={Zap}
                title="Shortlist Prediction"
                description="Know your chances of getting shortlisted for your target role before you apply."
              />
              <FeatureCard
                icon={Award}
                title="Keyword Optimization"
                description="Automatically identify and suggest domain-specific keywords to improve your resume."
              />
              <FeatureCard
                icon={CheckCircle}
                title="Resume Score"
                description="Receive an overall score for your resume with detailed feedback on strengths and weaknesses."
              />
              <FeatureCard
                icon={ArrowRight}
                title="Actionable Suggestions"
                description="Get specific recommendations to improve your resume for your target domain."
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 md:py-20 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Ready to Boost Your Job Search?
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Create a resume that stands out and gets you noticed by recruiters.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" asChild>
                  <Link to="/builder">
                    Build Your Resume <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/analyzer">
                    Analyze Existing Resume
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
