// useTutorial.ts
import { useState, useEffect } from 'react';

interface TutorialHookResult {
  showTutorial: boolean;
  hasCompletedTutorial: boolean;
  handleTutorialComplete: () => void;
  handleTutorialSkip: () => void;
  handleRestartTutorial: () => void;
}

/**
 * Custom hook to manage tutorial state
 * @param tutorialKey - The localStorage key to use for storing completion status
 * @returns An object containing tutorial state and functions
 */
export const useTutorial = (tutorialKey = 'ambientFinanceTutorialCompleted'): TutorialHookResult => {
  const [showTutorial, setShowTutorial] = useState<boolean>(false);
  const [hasCompletedTutorial, setHasCompletedTutorial] = useState<boolean>(false);

  // Check local storage on initial load to see if the user has completed the tutorial
  useEffect(() => {
    const tutorialCompleted = localStorage.getItem(tutorialKey);
    if (tutorialCompleted) {
      setHasCompletedTutorial(true);
    } else {
      // Show tutorial automatically for new users
      setShowTutorial(true);
    }
  }, [tutorialKey]);

  const handleTutorialComplete = (): void => {
    setShowTutorial(false);
    setHasCompletedTutorial(true);
    localStorage.setItem(tutorialKey, 'true');
  };

  const handleTutorialSkip = (): void => {
    setShowTutorial(false);
    // You might want to ask the user if they want to see the tutorial later
    // or simply mark it as completed
    localStorage.setItem(tutorialKey, 'true');
  };

  const handleRestartTutorial = (): void => {
    setShowTutorial(true);
  };

  return {
    showTutorial,
    hasCompletedTutorial,
    handleTutorialComplete,
    handleTutorialSkip,
    handleRestartTutorial
  };
};