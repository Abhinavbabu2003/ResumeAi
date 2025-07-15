
import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ResumeFormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  onAdd?: () => void;
  addButtonText?: string;
  className?: string;
  collapsible?: boolean;
}

const ResumeFormSection = ({
  title,
  description,
  children,
  onAdd,
  addButtonText = "Add",
  className,
  collapsible = false,
}: ResumeFormSectionProps) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <section className={cn("mb-8", className)}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        {collapsible && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? "Expand" : "Collapse"}
          </Button>
        )}
      </div>
      
      {!isCollapsed && (
        <div className="space-y-4 animate-fade-in">
          {children}
          
          {onAdd && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onAdd}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              {addButtonText}
            </Button>
          )}
        </div>
      )}
      
      <Separator className="mt-6" />
    </section>
  );
};

export const SectionItem = ({ 
  children, 
  onRemove,
  className
}: {
  children: React.ReactNode;
  onRemove?: () => void;
  className?: string;
}) => {
  return (
    <Card className={cn("border", className)}>
      <CardContent className="p-4 relative">
        {onRemove && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Remove</span>
          </Button>
        )}
        <div className="pr-8">{children}</div>
      </CardContent>
    </Card>
  );
};

export default ResumeFormSection;
