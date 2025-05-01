// useTutorial.ts
import { useState, useEffect, useCallback, useMemo } from 'react';

export interface TutorialStep {
  id: number;
  title: string;
  content: string;
  targetElementId?: string;
  targetDataAttribute?: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  totalSteps: number;
}

interface UseTutorialProps {
  steps: TutorialStep[];
  isEnabled: boolean;
  onComplete: () => void;
  onSkip: () => void;
  localStorageKey?: string;
}

export function useTutorial({
  steps,
  isEnabled,
  onComplete,
  onSkip,
  localStorageKey = 'tutorialCompleted'
}: UseTutorialProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  // Update visibility when enabled state changes
  useEffect(() => {
    setIsVisible(isEnabled);
  }, [isEnabled]);
  
  // Memoize current step to prevent unnecessary rerenders
  const currentStep = useMemo(() => 
    steps[currentStepIndex], 
    [steps, currentStepIndex]
  );
  
  // Handle navigation
  const handleNext = useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prevIndex => prevIndex + 1);
    } else {
      setIsVisible(false);
      if (localStorageKey) {
        try {
          localStorage.setItem(localStorageKey, 'true');
        } catch (error) {
          console.error('Error writing to localStorage:', error);
        }
      }
      onComplete();
    }
  }, [currentStepIndex, steps.length, localStorageKey, onComplete]);
  
  const handlePrevious = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prevIndex => prevIndex - 1);
    }
  }, [currentStepIndex]);
  
  const handleClose = useCallback(() => {
    setIsVisible(false);
    onSkip();
  }, [onSkip]);
  
  // Reset to first step when tutorial is opened
  useEffect(() => {
    if (isEnabled) {
      setCurrentStepIndex(0);
    }
  }, [isEnabled]);
  
  return {
    isVisible,
    currentStep,
    handleNext,
    handlePrevious,
    handleClose,
    currentStepIndex
  };
}