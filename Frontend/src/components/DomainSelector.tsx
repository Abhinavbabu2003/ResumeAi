
import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DomainSelectorProps {
  onSelect: (domain: string) => void;
  selectedDomain: string;
}

const domains = [
  { value: "software-development", label: "Software Development" },
  { value: "data-science", label: "Data Science" },
  { value: "web-development", label: "Web Development" },
  { value: "mobile-development", label: "Mobile Development" },
  { value: "ui-ux-design", label: "UI/UX Design" },
  { value: "digital-marketing", label: "Digital Marketing" },
  { value: "content-writing", label: "Content Writing" },
  { value: "finance", label: "Finance" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "human-resources", label: "Human Resources" },
];

const DomainSelector = ({ onSelect, selectedDomain }: DomainSelectorProps) => {
  const [open, setOpen] = useState(false);

  const selectedLabel = domains.find(domain => domain.value === selectedDomain)?.label || "Select domain";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedLabel}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search domain..." />
          <CommandEmpty>No domain found.</CommandEmpty>
          <CommandGroup>
            {domains.map((domain) => (
              <CommandItem
                key={domain.value}
                value={domain.value}
                onSelect={() => {
                  onSelect(domain.value);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedDomain === domain.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {domain.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default DomainSelector;
