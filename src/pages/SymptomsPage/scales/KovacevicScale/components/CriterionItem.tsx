import React from 'react';
import {
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Slider,
  FormControl,
  FormLabel,
} from '@mui/material';
import type { CriterionResponse, SeverityRating } from '../../../../../types/kovacevicScale';
import { KOVACEVIC_LABELS } from '../../../../../types/kovacevicScale';
import './CriterionItem.scss';

interface CriterionItemProps {
  /** Label for the criterion */
  label: string;
  /** Current response value */
  response: CriterionResponse;
  /** Callback when response changes */
  onResponseChange: (value: CriterionResponse) => void;
  /** Whether to show severity slider */
  showSeverity?: boolean;
  /** Current severity value (0-5) */
  severity?: SeverityRating;
  /** Callback when severity changes */
  onSeverityChange?: (value: SeverityRating) => void;
  /** Optional additional note */
  note?: string;
  /** Whether this is a required criterion */
  required?: boolean;
}

const severityMarks = [
  { value: 0, label: '0' },
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' },
];

const CriterionItem: React.FC<CriterionItemProps> = ({
  label,
  response,
  onResponseChange,
  showSeverity = false,
  severity = 0,
  onSeverityChange,
  note,
  required = false,
}) => {
  const handleResponseChange = (
    _event: React.MouseEvent<HTMLElement>,
    newValue: CriterionResponse | null
  ) => {
    if (newValue !== null) {
      onResponseChange(newValue);
    }
  };

  const handleSeverityChange = (_event: Event, newValue: number | number[]) => {
    if (onSeverityChange && typeof newValue === 'number') {
      onSeverityChange(newValue as SeverityRating);
    }
  };

  const getSeverityLabel = (value: number): string => {
    return KOVACEVIC_LABELS.severity[value as SeverityRating] || '';
  };

  return (
    <Box className="criterion-item">
      <FormControl fullWidth>
        <FormLabel className="criterion-item__label">
          {label}
          {required && <span className="required-mark">*</span>}
        </FormLabel>

        {note && (
          <Typography variant="caption" className="criterion-item__note">
            {note}
          </Typography>
        )}

        <Box className="criterion-item__response">
          <ToggleButtonGroup
            value={response}
            exclusive
            onChange={handleResponseChange}
            aria-label="criterion response"
            className="response-buttons"
          >
            <ToggleButton value="yes" className="response-btn response-btn--yes">
              {KOVACEVIC_LABELS.responses.yes}
            </ToggleButton>
            <ToggleButton value="no" className="response-btn response-btn--no">
              {KOVACEVIC_LABELS.responses.no}
            </ToggleButton>
            <ToggleButton value="unknown" className="response-btn response-btn--unknown">
              {KOVACEVIC_LABELS.responses.unknown}
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {showSeverity && response === 'yes' && (
          <Box className="criterion-item__severity">
            <Typography variant="body2" className="severity-label">
              חומרה: <strong>{getSeverityLabel(severity)}</strong>
            </Typography>
            <Slider
              value={severity}
              onChange={handleSeverityChange}
              min={0}
              max={5}
              step={1}
              marks={severityMarks}
              valueLabelDisplay="auto"
              valueLabelFormat={getSeverityLabel}
              className="severity-slider"
            />
          </Box>
        )}
      </FormControl>
    </Box>
  );
};

export default CriterionItem;
