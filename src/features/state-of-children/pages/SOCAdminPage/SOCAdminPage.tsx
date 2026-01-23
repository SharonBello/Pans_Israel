import React, { useState, useEffect, useMemo } from 'react';
import {
    Box,
    Typography,
    Container,
    Button,
    CircularProgress,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    FormControlLabel,
    Checkbox,
    TextField,
} from '@mui/material';
import { FiDownload, FiRefreshCw, FiFilter, FiFileText, FiGrid } from 'react-icons/fi';
import { getSurveyResponses, getSurveyResponseCount, getUniqueFamilyCount } from '../../../shared/services/surveyService';
import { exportToCSV, exportToExcel, downloadFile, getQuestionLabelsFromCategories } from '../../../shared/services/surveyExportService';
import { SOC_SURVEY_ID } from '../../types/socTypes';
import { socCategories } from '../../data/socQuestions';
import type { BaseSurveyResponse } from '../../../shared/types/baseSurveyTypes';
import { Timestamp } from 'firebase/firestore';
import './SOCAdminPage.scss';

// --------------------------------------------------------------------------
// Component
// --------------------------------------------------------------------------

const SOCAdminPage: React.FC = () => {
    const [responses, setResponses] = useState<BaseSurveyResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [totalCount, setTotalCount] = useState(0);
    const [familyCount, setFamilyCount] = useState(0);

    // Export options
    const [includeSerial, setIncludeSerial] = useState(false);
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    // Question labels for export
    const questionLabels = useMemo(() => 
        getQuestionLabelsFromCategories(socCategories), []);

    // --------------------------------------------------------------------------
    // Fetch Data
    // --------------------------------------------------------------------------

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const [responsesData, total, families] = await Promise.all([
                getSurveyResponses(SOC_SURVEY_ID),
                getSurveyResponseCount(SOC_SURVEY_ID),
                getUniqueFamilyCount(SOC_SURVEY_ID),
            ]);
            setResponses(responsesData);
            setTotalCount(total);
            setFamilyCount(families);
        } catch (err) {
            setError('שגיאה בטעינת הנתונים');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // --------------------------------------------------------------------------
    // Filter Responses
    // --------------------------------------------------------------------------

    const filteredResponses = useMemo(() => {
        let filtered = [...responses];

        if (dateFrom) {
            const fromDate = new Date(dateFrom);
            filtered = filtered.filter(r => {
                const submittedAt = r.submittedAt instanceof Timestamp 
                    ? r.submittedAt.toDate() 
                    : new Date();
                return submittedAt >= fromDate;
            });
        }

        if (dateTo) {
            const toDate = new Date(dateTo);
            toDate.setHours(23, 59, 59, 999);
            filtered = filtered.filter(r => {
                const submittedAt = r.submittedAt instanceof Timestamp 
                    ? r.submittedAt.toDate() 
                    : new Date();
                return submittedAt <= toDate;
            });
        }

        return filtered;
    }, [responses, dateFrom, dateTo]);

    // --------------------------------------------------------------------------
    // Export Handlers
    // --------------------------------------------------------------------------

    const handleExportCSV = async () => {
        try {
            setExporting(true);
            setError(null);
            
            const csvContent = exportToCSV(filteredResponses, questionLabels, includeSerial);
            const filename = `soc_survey_${new Date().toISOString().split('T')[0]}.csv`;
            downloadFile(csvContent, filename, 'text/csv;charset=utf-8');
            
            setSuccess(`יוצאו ${filteredResponses.length} תשובות לקובץ CSV`);
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError('שגיאה בייצוא הקובץ');
            console.error(err);
        } finally {
            setExporting(false);
        }
    };

    const handleExportExcel = async () => {
        try {
            setExporting(true);
            setError(null);
            
            const excelBlob = await exportToExcel(
                filteredResponses, 
                SOC_SURVEY_ID, 
                questionLabels, 
                includeSerial
            );
            const filename = `soc_survey_${new Date().toISOString().split('T')[0]}.xlsx`;
            downloadFile(excelBlob, filename, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            
            setSuccess(`יוצאו ${filteredResponses.length} תשובות לקובץ Excel`);
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError('שגיאה בייצוא הקובץ. ודאו שספריית xlsx מותקנת.');
            console.error(err);
        } finally {
            setExporting(false);
        }
    };

    const handleExportJSON = () => {
        try {
            setExporting(true);
            setError(null);
            
            const jsonContent = JSON.stringify(filteredResponses, null, 2);
            const filename = `soc_survey_${new Date().toISOString().split('T')[0]}.json`;
            downloadFile(jsonContent, filename, 'application/json');
            
            setSuccess(`יוצאו ${filteredResponses.length} תשובות לקובץ JSON`);
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError('שגיאה בייצוא הקובץ');
            console.error(err);
        } finally {
            setExporting(false);
        }
    };

    // --------------------------------------------------------------------------
    // Format Date
    // --------------------------------------------------------------------------

    const formatDate = (timestamp: Timestamp | undefined): string => {
        if (!timestamp) return '-';
        const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date();
        return date.toLocaleDateString('he-IL', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // --------------------------------------------------------------------------
    // Render
    // --------------------------------------------------------------------------

    return (
        <Box className="soc-admin" dir="rtl">
            <Container maxWidth="lg">
                {/* Header */}
                <Box className="soc-admin__header">
                    <Typography variant="h4" className="soc-admin__title">
                        ניהול סקר מצב ילדינו 2026
                    </Typography>
                    <Typography className="soc-admin__subtitle">
                        צפייה בתשובות וייצוא נתונים
                    </Typography>
                </Box>

                {/* Stats Summary */}
                <Box className="soc-admin__stats">
                    <Box className="soc-admin__stat">
                        <Typography className="soc-admin__stat-value">{totalCount}</Typography>
                        <Typography className="soc-admin__stat-label">תשובות</Typography>
                    </Box>
                    <Box className="soc-admin__stat">
                        <Typography className="soc-admin__stat-value">{familyCount}</Typography>
                        <Typography className="soc-admin__stat-label">משפחות</Typography>
                    </Box>
                    <Box className="soc-admin__stat">
                        <Typography className="soc-admin__stat-value">{filteredResponses.length}</Typography>
                        <Typography className="soc-admin__stat-label">מסוננות</Typography>
                    </Box>
                </Box>

                {/* Alerts */}
                {error && (
                    <Alert severity="error" className="soc-admin__alert" onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}
                {success && (
                    <Alert severity="success" className="soc-admin__alert" onClose={() => setSuccess(null)}>
                        {success}
                    </Alert>
                )}

                {/* Filters & Export */}
                <Box className="soc-admin__controls">
                    <Box className="soc-admin__filters">
                        <Typography className="soc-admin__section-title">
                            <FiFilter /> סינון
                        </Typography>
                        <Box className="soc-admin__filter-row">
                            <TextField
                                type="date"
                                label="מתאריך"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                size="small"
                                className="soc-admin__date-input"
                            />
                            <TextField
                                type="date"
                                label="עד תאריך"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                size="small"
                                className="soc-admin__date-input"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={includeSerial}
                                        onChange={(e) => setIncludeSerial(e.target.checked)}
                                    />
                                }
                                label="כלול מספר סידורי"
                            />
                        </Box>
                    </Box>

                    <Box className="soc-admin__export">
                        <Typography className="soc-admin__section-title">
                            <FiDownload /> ייצוא
                        </Typography>
                        <Box className="soc-admin__export-buttons">
                            <Button
                                variant="contained"
                                onClick={handleExportCSV}
                                disabled={exporting || filteredResponses.length === 0}
                                startIcon={exporting ? <CircularProgress size={16} /> : <FiFileText />}
                                className="soc-admin__export-btn"
                            >
                                CSV
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleExportExcel}
                                disabled={exporting || filteredResponses.length === 0}
                                startIcon={exporting ? <CircularProgress size={16} /> : <FiGrid />}
                                className="soc-admin__export-btn soc-admin__export-btn--excel"
                            >
                                Excel
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={handleExportJSON}
                                disabled={exporting || filteredResponses.length === 0}
                                className="soc-admin__export-btn soc-admin__export-btn--json"
                            >
                                JSON
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={fetchData}
                                disabled={loading}
                                startIcon={loading ? <CircularProgress size={16} /> : <FiRefreshCw />}
                            >
                                רענן
                            </Button>
                        </Box>
                    </Box>
                </Box>

                {/* Data Table */}
                <Box className="soc-admin__table-container">
                    {loading ? (
                        <Box className="soc-admin__loading">
                            <CircularProgress />
                            <Typography>טוען נתונים...</Typography>
                        </Box>
                    ) : filteredResponses.length === 0 ? (
                        <Box className="soc-admin__empty">
                            <Typography>אין תשובות להצגה</Typography>
                        </Box>
                    ) : (
                        <TableContainer component={Paper} className="soc-admin__table">
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>#</TableCell>
                                        {includeSerial && <TableCell>מס' סידורי</TableCell>}
                                        <TableCell>מס' ילד</TableCell>
                                        <TableCell>תאריך</TableCell>
                                        <TableCell>מגדר</TableCell>
                                        <TableCell>גיל התפרצות</TableCell>
                                        <TableCell>טריגר</TableCell>
                                        <TableCell>מצב נוכחי</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredResponses.map((response, index) => (
                                        <TableRow key={response.id || index} hover>
                                            <TableCell>{index + 1}</TableCell>
                                            {includeSerial && (
                                                <TableCell>
                                                    <Chip 
                                                        label={response.serial} 
                                                        size="small" 
                                                        variant="outlined"
                                                    />
                                                </TableCell>
                                            )}
                                            <TableCell>{response.childIndex}</TableCell>
                                            <TableCell>{formatDate(response.submittedAt)}</TableCell>
                                            <TableCell>
                                                {response.answers.child_gender === 'male' ? 'זכר' :
                                                 response.answers.child_gender === 'female' ? 'נקבה' : '-'}
                                            </TableCell>
                                            <TableCell>{response.answers.child_onset_age || '-'}</TableCell>
                                            <TableCell>
                                                {response.answers.primary_trigger === 'strep' ? 'סטרפטוקוק' :
                                                 response.answers.primary_trigger === 'mycoplasma' ? 'מיקופלזמה' :
                                                 response.answers.primary_trigger || '-'}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={
                                                        response.answers.symptoms_remitted === 'full_remission' ? 'הפוגה' :
                                                        response.answers.symptoms_remitted === 'mostly_managed' ? 'מנוהל' :
                                                        response.answers.symptoms_remitted === 'still_struggling' ? 'מתמודד' :
                                                        'לא ידוע'
                                                    }
                                                    size="small"
                                                    color={
                                                        response.answers.symptoms_remitted === 'full_remission' ? 'success' :
                                                        response.answers.symptoms_remitted === 'mostly_managed' ? 'info' :
                                                        'default'
                                                    }
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Box>

                {/* Note */}
                <Box className="soc-admin__note">
                    <Typography>
                        * לשמירה על פרטיות, מספרים סידוריים אינם מקושרים לתשובות בברירת מחדל.
                        הפעלת האפשרות "כלול מספר סידורי" מיועדת למחקר בלבד.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default SOCAdminPage;
