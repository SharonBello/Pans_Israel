import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import './QuestionCard.scss';
import { RatingValue, SymptomGroup } from '../../types/pansTypes';
import SymptomRating from '../SymptomRating/SymptomRating';

interface QuestionCardProps {
  question: SymptomGroup;
  onAnswer: (id: string, field: 'before' | 'after' | 'current', value: RatingValue) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onAnswer }) => {
  const { t } = useTranslation();

  return (
    <Card className="question-card">
      <CardContent>
        {/* תווית השאלה */}
        <Typography className="question-card__label">
          {t(`questions.${question.id}.label`)}
        </Typography>

        {/* תיבת הרייטינג (שלושת הסלאידרים) */}
        <Box className="question-card__rating-container">
          {/* נוסיף props ל־SymptomRating שמציינים className ל־Grid item */}
          <SymptomRating
            id={question.id}
            label=""
            ratingBefore={question.ratingBefore}
            ratingAfter={question.ratingAfter}
            ratingCurrent={question.ratingCurrent}
            onChange={onAnswer}
            itemClass="rating-grid-item" // נשלח מחלקת SCSS מותאמת
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
