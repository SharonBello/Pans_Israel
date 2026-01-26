import React, { useEffect } from 'react';
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

    useEffect(() => {
        if (question.type === 'scale' && value === undefined) {
            const minValue = question.scaleMin ?? 0;
            onChange(minValue);
        }
    }, [question.type, question.scaleMin]);

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

        // Check if an option is a "none" type option (mutually exclusive)
        const nonePatterns = ['none', 'לא', 'אף אחד', 'לא רלוונטי', 'אין', 'ללא'];
        const isNoneOption = (optionValue: string, optionLabel?: string): boolean => {
            const checkValue = (optionValue || '').toLowerCase();
            const checkLabel = (optionLabel || '').toLowerCase();
            return nonePatterns.some(pattern =>
                checkValue.includes(pattern.toLowerCase()) ||
                checkLabel.includes(pattern.toLowerCase())
            );
        };

        const handleCheckboxChange = (optionValue: string, optionLabel: string, checked: boolean) => {
            const optionIsNone = isNoneOption(optionValue, optionLabel);

            if (checked) {
                if (optionIsNone) {
                    // Selecting "none" clears all other selections
                    onChange([optionValue]);
                } else {
                    // Selecting a regular option removes any "none" options
                    const filtered = selectedValues.filter(v => {
                        const opt = question.options?.find(o => String(o.value) === v);
                        return !isNoneOption(v, opt?.label);
                    });
                    onChange([...filtered, optionValue]);
                }
            } else {
                // Unchecking - just remove this option
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
                                    handleCheckboxChange(
                                        String(option.value),
                                        option.label,
                                        e.target.checked
                                    )
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

        // FIX: Use min as fallback, but 0 is a valid value
        const currentValue = typeof value === 'number' ? value : min;

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
                    value={currentValue}
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
    const renderYesNo = () => {
        // Determine current toggle value handling all representations
        let toggleValue: 'yes' | 'no' | null = null;

        if (value === true || value === 'true' || value === 'yes' || value === 'כן') {
            toggleValue = 'yes';
        } else if (value === false || value === 'false' || value === 'no' || value === 'לא') {
            toggleValue = 'no';
        }

        return (
            <ToggleButtonGroup
                value={toggleValue}
                exclusive
                onChange={(_, newValue) => {
                    if (newValue !== null) {
                        onChange(newValue === 'yes');
                    }
                    // Don't allow deselection - keep current value
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
    };

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
    const renderNumber = () => {
        // Display empty string for undefined/null, but show 0 if value is 0
        const displayValue = value !== undefined && value !== null && value !== ''
            ? String(value)
            : '';

        return (
            <TextField
                type="number"
                value={displayValue}
                onChange={(e) => {
                    const inputVal = e.target.value;
                    if (inputVal === '') {
                        // Field cleared - store empty string or undefined
                        onChange('' as unknown as number);
                    } else {
                        const numValue = Number(inputVal);
                        // Only update if it's a valid number (0 is valid!)
                        if (!isNaN(numValue)) {
                            onChange(numValue);
                        }
                    }
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
    };
    
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
