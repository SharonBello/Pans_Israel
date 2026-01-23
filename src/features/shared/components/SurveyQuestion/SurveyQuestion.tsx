import React from 'react';
import {
    Box,
    Typography,
    TextField,
    Radio,
    RadioGroup,
    FormControlLabel,
    Checkbox,
    FormGroup,
    Slider,
    FormControl,
    FormHelperText,
    ToggleButtonGroup,
    ToggleButton,
} from '@mui/material';
import type { BaseQuestion } from '../../types/baseSurveyTypes';
import './SurveyQuestion.scss';

interface SurveyQuestionProps {
    question: BaseQuestion;
    value: string | number | boolean | string[] | undefined;
    onChange: (value: string | number | boolean | string[]) => void;
    error?: string;
    disabled?: boolean;
}

const SurveyQuestion: React.FC<SurveyQuestionProps> = ({
    question,
    value,
    onChange,
    error,
    disabled = false,
}) => {
    // --------------------------------------------------------------------------
    // Single Choice (Radio)
    // --------------------------------------------------------------------------
    const renderSingleChoice = () => (
        <RadioGroup
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="survey-question__radio-group"
        >
            {question.options?.map((option) => (
                <FormControlLabel
                    key={option.id}
                    value={option.value}
                    control={<Radio disabled={disabled} />}
                    label={option.label}
                    className="survey-question__radio-option"
                />
            ))}
        </RadioGroup>
    );

    // --------------------------------------------------------------------------
    // Multiple Choice (Checkboxes)
    // --------------------------------------------------------------------------
    const renderMultipleChoice = () => {
        const selectedValues = Array.isArray(value) ? value : [];

        const handleCheckboxChange = (optionValue: string, checked: boolean) => {
            if (checked) {
                onChange([...selectedValues, optionValue]);
            } else {
                onChange(selectedValues.filter((v) => v !== optionValue));
            }
        };

        return (
            <FormGroup className="survey-question__checkbox-group">
                {question.options?.map((option) => (
                    <FormControlLabel
                        key={option.id}
                        control={
                            <Checkbox
                                checked={selectedValues.includes(String(option.value))}
                                onChange={(e) =>
                                    handleCheckboxChange(String(option.value), e.target.checked)
                                }
                                disabled={disabled}
                            />
                        }
                        label={option.label}
                        className="survey-question__checkbox-option"
                    />
                ))}
            </FormGroup>
        );
    };

    // --------------------------------------------------------------------------
    // Scale (Slider)
    // --------------------------------------------------------------------------
    const renderScale = () => {
        const min = question.scaleMin ?? 0;
        const max = question.scaleMax ?? 5;
        const marks = [];

        for (let i = min; i <= max; i++) {
            marks.push({
                value: i,
                label: i === min ? question.scaleMinLabel || String(i) :
                       i === max ? question.scaleMaxLabel || String(i) : String(i),
            });
        }

        return (
            <Box className="survey-question__scale">
                <Box className="survey-question__scale-labels">
                    <Typography variant="caption" className="survey-question__scale-label">
                        {question.scaleMinLabel || min}
                    </Typography>
                    <Typography variant="caption" className="survey-question__scale-label">
                        {question.scaleMaxLabel || max}
                    </Typography>
                </Box>
                <Slider
                    value={typeof value === 'number' ? value : min}
                    onChange={(_, newValue) => onChange(newValue as number)}
                    min={min}
                    max={max}
                    step={1}
                    marks={marks}
                    valueLabelDisplay="on"
                    disabled={disabled}
                    className="survey-question__slider"
                />
            </Box>
        );
    };

    // --------------------------------------------------------------------------
    // Yes/No Toggle
    // --------------------------------------------------------------------------
    const renderYesNo = () => (
        <ToggleButtonGroup
            value={value === true || value === 'true' || value === 'yes' ? 'yes' : 
                   value === false || value === 'false' || value === 'no' ? 'no' : null}
            exclusive
            onChange={(_, newValue) => {
                if (newValue !== null) {
                    onChange(newValue === 'yes');
                }
            }}
            className="survey-question__toggle-group"
            disabled={disabled}
        >
            <ToggleButton value="yes" className="survey-question__toggle-btn">
                כן
            </ToggleButton>
            <ToggleButton value="no" className="survey-question__toggle-btn">
                לא
            </ToggleButton>
        </ToggleButtonGroup>
    );

    // --------------------------------------------------------------------------
    // Text Input
    // --------------------------------------------------------------------------
    const renderText = () => (
        <TextField
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            multiline
            rows={3}
            fullWidth
            placeholder="הקלידו את תשובתכם..."
            inputProps={{
                maxLength: question.maxLength || 1000,
            }}
            disabled={disabled}
            className="survey-question__text-field"
            dir="rtl"
        />
    );

    // --------------------------------------------------------------------------
    // Number Input
    // --------------------------------------------------------------------------
    const renderNumber = () => (
        <TextField
            type="number"
            value={value ?? ''}
            onChange={(e) => {
                const numValue = e.target.value === '' ? '' : Number(e.target.value);
                onChange(numValue as number);
            }}
            inputProps={{
                min: question.min,
                max: question.max,
            }}
            disabled={disabled}
            className="survey-question__number-field"
            dir="ltr"
        />
    );

    // --------------------------------------------------------------------------
    // Date Input
    // --------------------------------------------------------------------------
    const renderDate = () => (
        <TextField
            type="date"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className="survey-question__date-field"
            InputLabelProps={{
                shrink: true,
            }}
        />
    );

    // --------------------------------------------------------------------------
    // Email Input
    // --------------------------------------------------------------------------
    const renderEmail = () => (
        <TextField
            type="email"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            fullWidth
            placeholder="your@email.com"
            disabled={disabled}
            className="survey-question__email-field"
            dir="ltr"
        />
    );

    // --------------------------------------------------------------------------
    // Render based on question type
    // --------------------------------------------------------------------------
    const renderInput = () => {
        switch (question.type) {
            case 'single_choice':
                return renderSingleChoice();
            case 'multiple_choice':
                return renderMultipleChoice();
            case 'scale':
                return renderScale();
            case 'yes_no':
                return renderYesNo();
            case 'text':
                return renderText();
            case 'number':
                return renderNumber();
            case 'date':
                return renderDate();
            case 'email':
                return renderEmail();
            default:
                return <Typography color="error">סוג שאלה לא נתמך</Typography>;
        }
    };

    return (
        <FormControl
            component="fieldset"
            error={!!error}
            className={`survey-question ${error ? 'survey-question--error' : ''}`}
            fullWidth
        >
            <Box className="survey-question__header">
                <Typography
                    component="legend"
                    className="survey-question__text"
                >
                    {question.questionText}
                    {question.required && (
                        <span className="survey-question__required">*</span>
                    )}
                </Typography>
                {question.questionSubtext && (
                    <Typography className="survey-question__subtext">
                        {question.questionSubtext}
                    </Typography>
                )}
            </Box>

            <Box className="survey-question__input">
                {renderInput()}
            </Box>

            {error && (
                <FormHelperText className="survey-question__error">
                    {error}
                </FormHelperText>
            )}
        </FormControl>
    );
};

export default SurveyQuestion;
