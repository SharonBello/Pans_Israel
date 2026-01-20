import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { RatingValue, SubSymptom, SymptomGroup } from '../../../../../../types/pandasScale';
import SymptomRating from '../SymptomRating/SymptomRating';
import './SurveySection.scss'
import { useNavigate } from 'react-router-dom';

type SurveyItem = SymptomGroup | SubSymptom;

interface SurveySectionProps {
    title: string;
    items: SurveyItem[];
    onComplete: (answers: SurveyItem[]) => void;
    onGoBack?: () => void;
    isFirstSection?: boolean;
}

const SurveySection: React.FC<SurveySectionProps> = ({ title, items, onComplete, onGoBack, isFirstSection = false }) => {
    const { t } = useTranslation();
    const [answers, setAnswers] = useState<SurveyItem[]>([...items]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [mode, setMode] = useState<'survey' | 'review'>('survey');
    const navigate = useNavigate();

    const total = items.length;

    const handleRatingChange = (id: string, field: 'before' | 'after' | 'current', value: RatingValue) => {
        setAnswers(prev =>
            prev.map(item =>
                item.id === id
                    ? {
                        ...item,
                        ratingBefore: field === 'before' ? value : (item.ratingBefore as RatingValue),
                        ratingAfter: field === 'after' ? value : (item.ratingAfter as RatingValue),
                        ratingCurrent: field === 'current' ? value : (item.ratingCurrent as RatingValue),
                    } as SurveyItem
                    : item
            )
        );
    };

    const goNext = () => {
        if (currentIndex < total - 1) {
            setCurrentIndex(idx => idx + 1);
        } else {
            setMode('review');
        }
    };

    const goBack = () => {
        if (currentIndex > 0) {
            // Within section: go to previous question
            setCurrentIndex(idx => idx - 1);
        } else {
            // At first question of section
            if (isFirstSection) {
                // First section: go back to homepage
                navigate('/');
            } else {
                // Not first section: go back to previous section
                if (onGoBack) {
                    onGoBack();
                }
            }
        }
    };

    const handleEdit = (index: number) => {
        setCurrentIndex(index);
        setMode('survey');
    };

    const handleFinish = () => {
        onComplete(answers);
    };

    return (
        <Box sx={{ mb: 4, direction: 'rtl' }}>
            {mode === 'survey' ? (
                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }} className='section-title-container'>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }} className='section-title'>
                            {t(title)}
                        </Typography>
                        <Typography color="textSecondary">
                            {`שאלה ${currentIndex + 1} מתוך ${total}`}
                        </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <Typography sx={{ mb: 1, mt: 2, textAlign: 'center', fontWeight: 'bold', fontFamily: 'Heebo' }}>
                            {/* כאן נציג label (OCD) או sublabel (SubSymptom) */}
                            {(answers[currentIndex] as SymptomGroup).label ||
                                (answers[currentIndex] as SubSymptom).sublabel}
                        </Typography>
                        <SymptomRating
                            id={answers[currentIndex].id}
                            label={
                                (answers[currentIndex] as SymptomGroup).label ||
                                (answers[currentIndex] as SubSymptom).sublabel
                            }
                            ratingBefore={(answers[currentIndex] as any).ratingBefore}
                            ratingAfter={(answers[currentIndex] as any).ratingAfter}
                            ratingCurrent={(answers[currentIndex] as any).ratingCurrent}
                            onChange={handleRatingChange}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button variant="text" onClick={goBack}>חזור</Button>
                        <Button variant="contained" onClick={goNext} className='next-btn'>
                            {currentIndex < total - 1 ? 'הבא' : 'סיים סקירה'}
                        </Button>
                    </Box>
                </Box>
            ) : (
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }} gutterBottom>
                        {title}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        {t('common.reviewPrompt')}
                    </Typography>
                    <Box component="div" style={{textAlign: 'right' }} className='answer-desc'>
                        {answers.map((item, idx) => (
                            <Box key={item.id}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    mb: 1,
                                    p: 1,
                                    bgcolor: '#F7F7FC',
                                    borderRadius: 1,
                                }}
                            >
                                <Typography variant="body2" sx={{ flex: 1, textAlign: 'right' }}>
                                    {('label' in item)
                                        ? t(`questions.${item.id}.label`)
                                        : t(`associated.${item.id}.label`)}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, width: 120, justifyContent: 'space-evenly' }}>
                                    <Typography variant="caption">{(item as any).ratingBefore}</Typography>
                                    <Typography variant="caption">{(item as any).ratingAfter}</Typography>
                                    <Typography variant="caption">{(item as any).ratingCurrent}</Typography>
                                </Box>
                                <Button size="small" onClick={() => handleEdit(idx)} sx={{ minWidth: 32, mr: 1 }}>ערוך</Button>
                            </Box>
                        ))}
                    </Box>

                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Button variant="contained" onClick={handleFinish} className='next-btn'>
                            המשך לחלק הבא
                        </Button>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default SurveySection;
