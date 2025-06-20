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
    arrowColor: '#4f46e5',
    backgroundColor: '#ffffff',
    primaryColor: '#4f46e5',
    textColor: '#333',
    zIndex: 10000,
  },
  tooltipContainer: {
    textAlign: 'left' as const,
  },
  tooltipTitle: {
    fontSize: '16px',
    fontWeight: 600,
  },
  buttonNext: {
    backgroundColor: '#4f46e5',
    fontSize: '14px',
  },
  buttonBack: {
    color: '#666',
    fontSize: '14px',
    marginRight: 10,
  },
  buttonSkip: {
    color: '#666',
    fontSize: '14px',
  },
  buttonClose: {
    color: '#666',
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

    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setTourOpen(false);
      localStorage.setItem('space-hub-tour-completed', 'true');
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

  return {
    isTourOpen,
    setTourOpen,
    tourSteps,
    startTour,
    resetTour,
    tourComponent,
  };
};
