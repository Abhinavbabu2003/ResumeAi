
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, AlertCircle, CheckCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface Suggestion {
  text: string;
  type: "improvement" | "strength";
}

interface Analysis {
  score: number;
  domainMatch: number;
  keywords: string[];
  suggestions: Suggestion[];
  shortlisted: boolean;
}

interface AnalysisResultProps {
  analysis: Analysis;
  domain: string;
}

const AnalysisResult = ({ analysis, domain }: AnalysisResultProps) => {
  const domainLabel = domain.replace(/-/g, " ");
  
  const scoreColor = 
    analysis.score >= 80 ? "text-green-500" :
    analysis.score >= 60 ? "text-yellow-500" : 
    "text-red-500";
    
  const matchColor = 
    analysis.domainMatch >= 80 ? "text-green-500" :
    analysis.domainMatch >= 60 ? "text-yellow-500" : 
    "text-red-500";
    
  const shortlistedIcon = analysis.shortlisted ? 
    <CheckCircle className="h-5 w-5 text-green-500" /> : 
    <AlertCircle className="h-5 w-5 text-red-500" />;
    
  const shortlistedText = analysis.shortlisted ? 
    "Likely to be shortlisted" : 
    "May not be shortlisted";

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              <span className={scoreColor}>{analysis.score}%</span>
            </div>
            <Progress value={analysis.score} className="h-2 mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{domainLabel} Match</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              <span className={matchColor}>{analysis.domainMatch}%</span>
            </div>
            <Progress value={analysis.domainMatch} className="h-2 mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Shortlist Prediction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium flex items-center gap-2">
              {shortlistedIcon}
              <span>{shortlistedText}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Key Findings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2 flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Strengths
            </h3>
            <ul className="space-y-2 pl-6 list-disc">
              {analysis.suggestions
                .filter(s => s.type === "strength")
                .map((suggestion, index) => (
                  <li key={index}>{suggestion.text}</li>
                ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-2 flex items-center">
              <Info className="h-4 w-4 text-yellow-500 mr-2" />
              Areas for Improvement
            </h3>
            <ul className="space-y-2 pl-6 list-disc">
              {analysis.suggestions
                .filter(s => s.type === "improvement")
                .map((suggestion, index) => (
                  <li key={index}>{suggestion.text}</li>
                ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Domain Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {analysis.keywords.map((keyword, index) => (
                <Badge key={index} variant="secondary">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalysisResult;
