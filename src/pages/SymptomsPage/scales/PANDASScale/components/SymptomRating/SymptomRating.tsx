import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid';
import type { RatingValue } from '../../../../../../types/pandasScale';
import './SymptomRating.scss'

const ratingDescriptions: Record<RatingValue, string> = {
  0: '0 – אין עדות לסימפטום; אין פעילות כלל.',
  1: '1 – מינימלית (10): סימפטום ו/או התנהגות שמעט מזכירים את הסימפטום…',
  2: '2 – קלה (20): סימפטום ו/או התנהגות בולטת יותר…',
  3: '3 – בינונית (30): סימפטום ו/או התנהגות משמעותית…',
  4: '4 – חמורה (40): סימפטום ו/או התנהגות חמורים מאוד…',
  5: '5 – קיצונית (50): סימפטום ו/או התנהגות קיצונית…',
};

interface SymptomRatingProps {
  id: string;
  label: string;
  ratingBefore: RatingValue;
  ratingAfter: RatingValue;
  ratingCurrent: RatingValue;
  onChange: (id: string, field: 'before' | 'after' | 'current', value: RatingValue) => void;
  itemClass?: string;
  showSingle?: 'before' | 'after' | 'current';
}

const SymptomRating: React.FC<SymptomRatingProps> = ({
  id,
  ratingBefore,
  ratingAfter,
  ratingCurrent,
  onChange,
  itemClass = '',
  showSingle,
}) => {
  const { t } = useTranslation()

  const handleSliderChange = (
    field: 'before' | 'after' | 'current',
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = parseInt(event.target.value) as RatingValue;
    onChange(id, field, newValue);
  };

  const updateFill = (value: RatingValue, fillId: string) => {
    const percentage = (value / 5) * 100;
    const fillElement = document.getElementById(fillId);
    if (fillElement) {
      fillElement.style.width = `${percentage}%`;
    }
  };

  const getSeverityColor = (value: RatingValue): string => {
    const colors = ['#4CAF50', '#8BC34A', '#FFC107', '#FF9800', '#FF5722', '#F44336'];
    return colors[value];
  };

  const handleTrackClick = (event: React.MouseEvent<HTMLDivElement>, field: 'before' | 'after' | 'current') => {
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = clickX / rect.width;
    const value = Math.round((percentage) * 5) as RatingValue;
    const clampedValue = Math.max(0, Math.min(5, value)) as RatingValue;
    onChange(id, field, clampedValue);
  };

  React.useEffect(() => {
    if (showSingle) {
      const value = showSingle === 'before' ? ratingBefore :
        showSingle === 'after' ? ratingAfter : ratingCurrent;
      updateFill(value, `fill-${id}-${showSingle}`);

      // Update fill color based on severity
      const fillElement = document.getElementById(`fill-${id}-${showSingle}`);
      if (fillElement) {
        fillElement.style.background = getSeverityColor(value);
      }

      // Add click listeners for labels
      const labels = document.querySelectorAll(`#labels-${id}-${showSingle} span`);
      labels.forEach((label, index) => {
        const clickHandler = () => {
          const value = index as RatingValue;
          onChange(id, showSingle, value);
        };
        label.addEventListener('click', clickHandler);
      });

      // Cleanup
      return () => {
        const labels = document.querySelectorAll(`#labels-${id}-${showSingle} span`);
        labels.forEach((label) => {
          label.removeEventListener('click', () => { });
        });
      };
    } else {
      updateFill(ratingBefore, `fill-${id}-before`);
      updateFill(ratingAfter, `fill-${id}-after`);
      updateFill(ratingCurrent, `fill-${id}-current`);

      // Update fill colors based on severity
      const fillBefore = document.getElementById(`fill-${id}-before`);
      const fillAfter = document.getElementById(`fill-${id}-after`);
      const fillCurrent = document.getElementById(`fill-${id}-current`);

      if (fillBefore) fillBefore.style.background = getSeverityColor(ratingBefore);
      if (fillAfter) fillAfter.style.background = getSeverityColor(ratingAfter);
      if (fillCurrent) fillCurrent.style.background = getSeverityColor(ratingCurrent);

      // Add click listeners for labels
      const addLabelClickListeners = (field: 'before' | 'after' | 'current') => {
        const labels = document.querySelectorAll(`#labels-${id}-${field} span`);
        labels.forEach((label, index) => {
          const clickHandler = () => {
            const value = index as RatingValue;
            onChange(id, field, value);
          };
          label.addEventListener('click', clickHandler);
        });
      };

      addLabelClickListeners('before');
      addLabelClickListeners('after');
      addLabelClickListeners('current');

      // Cleanup
      return () => {
        const removeListeners = (field: 'before' | 'after' | 'current') => {
          const labels = document.querySelectorAll(`#labels-${id}-${field} span`);
          labels.forEach((label) => {
            label.removeEventListener('click', () => { });
          });
        };

        removeListeners('before');
        removeListeners('after');
        removeListeners('current');
      };
    }
  }, [ratingBefore, ratingAfter, ratingCurrent, id, onChange, showSingle]);

  // Single slider for table view
  if (showSingle) {
    const value = showSingle === 'before' ? ratingBefore :
      showSingle === 'after' ? ratingAfter : ratingCurrent;

    return (
      <div className="single-slider-wrapper">
        <div
          className="slider-wrapper"
          dir="ltr"
          onClick={(e) => handleTrackClick(e, showSingle)}
        >
          <div className="slider-fill" id={`fill-${id}-${showSingle}`}></div>
          <input
            type="range"
            min="0"
            max="5"
            value={value}
            className="range-slider"
            onChange={(e) => handleSliderChange(showSingle, e)}
            dir="ltr"
            aria-label={`${id}-${showSingle}`}
          />
        </div>
        <div className="slider-labels" dir="ltr" id={`labels-${id}-${showSingle}`}>
          <span>0</span>
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
          <span>5</span>
        </div>
      </div>
    );
  }

  return (
    <Box sx={{ mb: 2 }} dir={t('dir')}>
      <Grid container spacing={2} alignItems="center">
        {/* ===== טווח: שבוע לפני הופעה ראשונה ===== */}
        <Grid size={{ xs: 12, md: 4 }} className={itemClass}>
          <div className="slider-group">
            <div className="slider-label">
              <span>שבוע לפני הופעה ראשונה</span>
            </div>
            <div
              className="slider-wrapper"
              dir="ltr"
              onClick={(e) => handleTrackClick(e, 'before')}
            >
              <div className="slider-fill" id={`fill-${id}-before`}></div>
              <input
                type="range"
                min="0"
                max="5"
                value={ratingBefore}
                className="range-slider"
                onChange={(e) => handleSliderChange('before', e)}
                dir="ltr"
                aria-label={`${id}-before`}
              />
            </div>
            <div className="slider-labels" dir="ltr" id={`labels-${id}-before`}>
              <span>0</span>
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
            </div>
            <Typography
              className="rating-description"
              style={{ color: getSeverityColor(ratingBefore) }}
            >
              {ratingDescriptions[ratingBefore]}
            </Typography>
          </div>
        </Grid>

        {/* ===== טווח: שבוע אחרי הופעה ראשונה ===== */}
        <Grid size={{ xs: 12, md: 4 }} className={itemClass}>
          <div className="slider-group">
            <div className="slider-label">
              <span>שבוע אחרי הופעה ראשונה</span>
            </div>
            <div
              className="slider-wrapper"
              dir="ltr"
              onClick={(e) => handleTrackClick(e, 'after')}
            >
              <div className="slider-fill" id={`fill-${id}-after`}></div>
              <input
                type="range"
                min="0"
                max="5"
                value={ratingAfter}
                className="range-slider"
                onChange={(e) => handleSliderChange('after', e)}
                dir="ltr"
                aria-label={`${id}-after`}
              />
            </div>
            <div className="slider-labels" dir="ltr" id={`labels-${id}-after`}>
              <span>0</span>
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
            </div>
            <Typography
              className="rating-description"
              style={{ color: getSeverityColor(ratingAfter) }}
            >
              {ratingDescriptions[ratingAfter]}
            </Typography>
          </div>
        </Grid>

        {/* ===== טווח: 7 ימים אחרונים ===== */}
        <Grid size={{ xs: 12, md: 4 }} className={itemClass}>
          <div className="slider-group">
            <div className="slider-label">
              <span>7 ימים אחרונים</span>
            </div>
            <div
              className="slider-wrapper"
              dir="ltr"
              onClick={(e) => handleTrackClick(e, 'current')}
            >
              <div className="slider-fill" id={`fill-${id}-current`}></div>
              <input
                type="range"
                min="0"
                max="5"
                value={ratingCurrent}
                className="range-slider"
                onChange={(e) => handleSliderChange('current', e)}
                dir="ltr"
                aria-label={`${id}-current`}
              />
            </div>
            <div className="slider-labels" dir="ltr" id={`labels-${id}-current`}>
              <span>0</span>
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
            </div>
            <Typography
              className="rating-description"
              style={{ color: getSeverityColor(ratingCurrent) }}
            >
              {ratingDescriptions[ratingCurrent]}
            </Typography>
          </div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SymptomRating;