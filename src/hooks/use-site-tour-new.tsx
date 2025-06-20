import React from 'react';
import { useState, useEffect } from 'react';
import ReactJoyride, { 
  CallBackProps, 
  Step, 
  STATUS, 
  EVENTS, 
  Props as JoyrideProps,
  Styles
} from 'react-joyride';

export interface SiteTourProps {
  isTourOpen: boolean;
  setTourOpen: (isOpen: boolean) => void;
  tourSteps: Step[];
  startTour: () => void;
  resetTour: () => void;
  tourComponent: JSX.Element | null;
}

const defaultStyles = {
  options: {
    arrowColor: '#1f2937',
    backgroundColor: '#ffffff',
    primaryColor: '#3b82f6',
    textColor: '#1f2937',
    zIndex: 10000,
  },
  tooltipContainer: {
    textAlign: 'left' as const,
    borderRadius: '16px',
    padding: '24px',
    maxWidth: '400px',
    fontSize: '15px',
    lineHeight: '1.6',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  tooltipTitle: {
    fontSize: '20px',
    fontWeight: 700,
    marginBottom: '12px',
    color: '#1f2937',
  },
  tooltipContent: {
    fontSize: '15px',
    lineHeight: '1.6',
    color: '#374151',
    whiteSpace: 'pre-line' as const,
  },
  buttonNext: {
    backgroundColor: '#3b82f6',
    fontSize: '14px',
    fontWeight: 600,
    borderRadius: '8px',
    padding: '10px 20px',
    color: '#ffffff',
    border: 'none',
  },
  buttonBack: {
    color: '#6b7280',
    fontSize: '14px',
    marginRight: 12,
    fontWeight: 600,
    backgroundColor: 'transparent',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    padding: '10px 16px',
  },
  buttonSkip: {
    color: '#6b7280',
    fontSize: '14px',
    fontWeight: 600,
    backgroundColor: 'transparent',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    padding: '8px 16px',
  },
  buttonClose: {
    color: '#6b7280',
    fontSize: '14px',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  tooltip: {
    padding: '20px',
  },
  beacon: {
    animation: 'none',
  },
};

type JoyrideConfigProps = {
  callback: (data: CallBackProps) => void;
  continuous: boolean;
  run: boolean;
  scrollToFirstStep: boolean;
  showProgress: boolean;
  showSkipButton: boolean;
  stepIndex: number;
  steps: Step[];
  styles: typeof defaultStyles;
  disableCloseOnEsc?: boolean;
  disableOverlayClose?: boolean;
  disableScrolling?: boolean;
};

export const useSiteTour = (steps: Step[], autoStart = false): SiteTourProps => {
  const [isTourOpen, setTourOpen] = useState(false);
  const [tourSteps] = useState<Step[]>(steps);
  const [stepIndex, setStepIndex] = useState(0);
  const [tourKey, setTourKey] = useState(0);

  useEffect(() => {
    const hasTakenTour = localStorage.getItem('space-hub-tour-completed');
    if (autoStart && !hasTakenTour) {
      setTourOpen(true);
    }
  }, [autoStart]);
  const startTour = (): void => {
    console.log('useSiteTour: Starting tour with steps:', tourSteps);
    setTourOpen(true);
    setStepIndex(0);
    setTourKey(prev => prev + 1);
  };

  const resetTour = (): void => {
    setTourOpen(false);
    setStepIndex(0);
    localStorage.removeItem('space-hub-tour-completed');
  };
  const handleJoyrideCallback = (data: CallBackProps): void => {
    const { status, type, index } = data;

    if (type === EVENTS.STEP_AFTER) {
      setStepIndex(index + 1);
    }

    if (status === STATUS.FINISHED) {
      setTourOpen(false);
      localStorage.setItem('space-hub-tour-completed', 'true');
      console.log('🚀 Tour completed successfully! User learned about all features.');
    }
    
    if (status === STATUS.SKIPPED) {
      setTourOpen(false);
      localStorage.setItem('space-hub-tour-completed', 'true');
      console.log('⚡ Tour skipped by user.');
    }
  };

  const tourConfig: JoyrideConfigProps = {
    callback: handleJoyrideCallback,
    continuous: true,
    run: isTourOpen,
    scrollToFirstStep: true,
    showProgress: true,
    showSkipButton: true,
    stepIndex,
    steps: tourSteps,
    styles: defaultStyles,
    disableCloseOnEsc: false,
    disableOverlayClose: false,
    disableScrolling: false,
  };
  const tourComponent = isTourOpen ? (
    <div key={`tour-wrapper-${tourKey}`}>
      <ReactJoyride {...(tourConfig as JoyrideProps)} />
    </div>
  ) : null;

  // Debug logging
  React.useEffect(() => {
    console.log('useSiteTour: isTourOpen =', isTourOpen, 'steps count =', tourSteps.length);
  }, [isTourOpen, tourSteps.length]);

  return {
    isTourOpen,
    setTourOpen,
    tourSteps,
    startTour,
    resetTour,
    tourComponent,
  };
};