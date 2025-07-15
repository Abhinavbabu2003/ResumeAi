
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ResumeTemplateProps {
  name: string;
  description: string;
  imageSrc: string;
  isSelected?: boolean;
  onClick?: () => void;
}

const ResumeTemplate = ({ 
  name, 
  description, 
  imageSrc,
  isSelected = false,
  onClick
}: ResumeTemplateProps) => {
  return (
    <Card 
      className={cn(
        "relative cursor-pointer transition-all hover:shadow-md overflow-hidden",
        isSelected && "ring-2 ring-primary"
      )}
      onClick={onClick}
    >
      <div className="aspect-[3/4] overflow-hidden">
        <img 
          src={imageSrc} 
          alt={name} 
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium">{name}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
      {isSelected && (
        <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md">
          Selected
        </div>
      )}
    </Card>
  );
};

export default ResumeTemplate;
