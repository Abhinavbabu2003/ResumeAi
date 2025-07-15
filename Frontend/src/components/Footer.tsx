
import { FileText } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full border-t bg-background py-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-resume-primary" />
              <span className="text-lg font-bold">DomainResume</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              AI-powered resume builder and analyzer for domain-specific job applications.
            </p>
          </div>
          <div className="flex flex-col space-y-4">
            <h3 className="text-sm font-semibold">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link to="/builder" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Resume Builder
              </Link>
              <Link to="/analyzer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Resume Analyzer
              </Link>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
            </nav>
          </div>
          <div className="flex flex-col space-y-4">
            <h3 className="text-sm font-semibold">Legal</h3>
            <nav className="flex flex-col space-y-2">
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
            </nav>
          </div>
        </div>
        <div className="mt-8 border-t pt-6">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} DomainResume. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
