import React from 'react';
import { Box, Typography, LinearProgress, Stepper, Step, StepLabel } from '@mui/material';
import { FiCheck } from 'react-icons/fi';
import './SurveyProgress.scss';

interface SurveyProgressProps {
    currentCategoryIndex: number;
    totalCategories: number;
    categories: Array<{
        id: string;
        title: string;
        icon?: string;
    }>;
    questionsAnswered: number;
    totalQuestions: number;
    showStepper?: boolean;
    onCategoryClick?: (index: number) => void;
}

const SurveyProgress: React.FC<SurveyProgressProps> = ({
    currentCategoryIndex,
    totalCategories,
    categories,
    questionsAnswered,
    totalQuestions,
    showStepper = true,
    onCategoryClick,
}) => {
    const overallProgress = totalQuestions > 0
        ? Math.round((questionsAnswered / totalQuestions) * 100)
        : 0;

    return (
        <Box className="survey-progress">
            {/* Overall Progress Bar */}
            <Box className="survey-progress__bar-container">
                <Box className="survey-progress__bar-header">
                    <Typography className="survey-progress__bar-label">
                        התקדמות כללית
                    </Typography>
                    <Typography className="survey-progress__bar-percentage">
                        {overallProgress}%
                    </Typography>
                </Box>
                <LinearProgress
                    variant="determinate"
                    value={overallProgress}
                    className="survey-progress__bar"
                />
                <Typography className="survey-progress__bar-stats">
                    {questionsAnswered} מתוך {totalQuestions} שאלות
                </Typography>
            </Box>

            {/* Category Stepper */}
            {showStepper && (
                <Box className="survey-progress__stepper-container">
                    <Stepper
                        activeStep={currentCategoryIndex}
                        alternativeLabel
                        className="survey-progress__stepper"
                    >
                        {categories.map((category, index) => {
                            const isCompleted = index < currentCategoryIndex;
                            const isCurrent = index === currentCategoryIndex;

                            return (
                                <Step
                                    key={category.id}
                                    completed={isCompleted}
                                    className={`survey-progress__step ${isCurrent ? 'survey-progress__step--current' : ''
                                        } ${isCompleted ? 'survey-progress__step--completed' : ''}`}
                                    onClick={() => onCategoryClick?.(index)}
                                >
                                    <StepLabel
                                        StepIconComponent={() => (
                                            <Box className={`survey-progress__step-icon ${isCompleted ? 'survey-progress__step-icon--completed' : ''
                                                } ${isCurrent ? 'survey-progress__step-icon--current' : ''}`}>
                                                {isCompleted ? (
                                                    <FiCheck />
                                                ) : (
                                                    <span>{category.icon || index + 1}</span>
                                                )}
                                            </Box>
                                        )}
                                    >
                                        <Typography className={`survey-progress__step-label ${isCurrent ? 'survey-progress__step-label--current' : ''
                                            }`}>
                                            {category.title}
                                        </Typography>
                                    </StepLabel>
                                </Step>
                            );
                        })}
                    </Stepper>
                </Box>
            )}

            {/* Mobile Category Indicator */}
            <Box className="survey-progress__mobile-indicator">
                <Typography className="survey-progress__mobile-category">
                    {categories[currentCategoryIndex]?.icon} {categories[currentCategoryIndex]?.title}
                </Typography>
                <Typography className="survey-progress__mobile-count">
                    {currentCategoryIndex + 1} / {totalCategories}
                </Typography>
            </Box>
        </Box>
    );
};

export default SurveyProgress;
