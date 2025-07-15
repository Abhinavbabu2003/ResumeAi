import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of our context state
interface ResumeContextType {
  resumeFile: File | null;
  setResumeFile: (file: File | null) => void;
  jobDescription: string;
  setJobDescription: (description: string) => void;
  clearData: () => void;
}

// Create context with default values
const ResumeContext = createContext<ResumeContextType>({
  resumeFile: null,
  setResumeFile: () => {},
  jobDescription: '',
  setJobDescription: () => {},
  clearData: () => {},
});

// Define props for the provider component
interface ResumeProviderProps {
  children: ReactNode;
}

// Create provider component
export const ResumeProvider: React.FC<ResumeProviderProps> = ({ children }) => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState<string>('');

  const clearData = () => {
    setResumeFile(null);
    setJobDescription('');
  };

  return (
    <ResumeContext.Provider
      value={{
        resumeFile,
        setResumeFile,
        jobDescription,
        setJobDescription,
        clearData,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

// Create a custom hook for using this context
export const useResumeContext = () => useContext(ResumeContext);
