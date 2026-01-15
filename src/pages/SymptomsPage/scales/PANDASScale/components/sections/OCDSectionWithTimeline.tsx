import React from 'react';
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { RatingValue, SymptomGroup } from '../../types/pansTypes';
import SymptomRating from '../SymptomRating/SymptomRating';
import { useTranslation } from 'react-i18next';

interface OCDSectionProps {
    items: SymptomGroup[];
    onItemChange: (
        id: string,
        field: 'before' | 'after' | 'current',
        value: RatingValue
    ) => void;
    currentIndex?: number;
    total?: number;
}

const OCDSectionWithTimeline: React.FC<OCDSectionProps> = ({ items, onItemChange, currentIndex = 0, total = 0 }) => {
    const { t } = useTranslation()

    return (
        <Box sx={{ mb: 4, direction: 'rtl' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    I. תסמיני OCD (OCD 0–5 בכל טווח זמן)
                </Typography>
                {total > 0 && (
                    <Typography variant="h6" color="textSecondary">
                        {`שאלה ${currentIndex + 1} מתוך ${total}`}
                    </Typography>
                )}
            </Box>

            {/* טבלה עם כל הסימפטומים וה־Sliders שלהם */}
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell align="center" sx={{ fontWeight: 'bold', width: '35%' }}>
                            {t('ocdSection.column.topic')}
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold', width: '20%' }}>
                            {t('timelines.beforeFirstWeek')}
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold', width: '20%' }}>
                            {t('timelines.afterFirstWeek')}
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold', width: '20%' }}>
                            {t('timelines.last7Days')}
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map((item) => (
                        <TableRow key={item.id}>
                            {/* עמודה ראשונה: תיאור הסימפטום */}
                            <TableCell sx={{ textAlign: 'right' }}>
                                <Typography variant="body2">{t(`questions.${item.id}.label`)}</Typography>
                            </TableCell>

                            {/* עמודות שלושת ה Sliders */}
                            <TableCell>
                                <SymptomRating
                                    id={`${item.id}_before`}
                                    label=""
                                    ratingBefore={item.ratingBefore}
                                    ratingAfter={0}
                                    ratingCurrent={0}
                                    showSingle="before"
                                    onChange={(id, field, value) => {
                                        onItemChange(item.id, field, value);
                                    }}
                                />
                            </TableCell>
                            <TableCell>
                                <SymptomRating
                                    id={`${item.id}_after`}
                                    label=""
                                    ratingBefore={0}
                                    ratingAfter={item.ratingAfter}
                                    ratingCurrent={0}
                                    showSingle="after"
                                    onChange={(id, field, value) => {
                                        onItemChange(item.id, field, value);
                                    }}
                                />
                            </TableCell>
                            <TableCell>
                                <SymptomRating
                                    id={`${item.id}_current`}
                                    label=""
                                    ratingBefore={0}
                                    ratingAfter={0}
                                    ratingCurrent={item.ratingCurrent}
                                    showSingle="current"
                                    onChange={(id, field, value) => {
                                        onItemChange(item.id, field, value);
                                    }}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Box>
    );
};

export default OCDSectionWithTimeline;
