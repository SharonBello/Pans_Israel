import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Container,
    Modal,
    Paper,
    Alert,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
    Science as ScienceIcon,
    CheckCircleOutline as CheckIcon,
    Warning as WarningIcon,
    ArrowBack as ArrowIcon,
} from '@mui/icons-material';
import './KovacevicHomePage.scss';

const KovacevicHomePage: React.FC = () => {
    const [openExplanation, setOpenExplanation] = useState(false);
    const navigate = useNavigate();

    const handleStartScale = () => setOpenExplanation(true);
    const handleCloseExplanation = () => setOpenExplanation(false);

    const handleConfirmStart = () => {
        setOpenExplanation(false);
        navigate('/scales/kovacevic/form');
    };

    return (
        <Box className="kovacevic-homepage">
            <Container maxWidth="md" className="kovacevic-homepage__container">
                {/* Hero Section */}
                <Paper elevation={3} className="kovacevic-homepage__hero">
                    <Box className="hero-icon">
                        <ScienceIcon sx={{ fontSize: 60, color: '#6C5CE7' }} />
                    </Box>

                    <Typography variant="h3" component="h1" className="hero-title">
                        קריטריוני האבחון של ד"ר קובאצ'ביץ'
                    </Typography>

                    <Typography variant="h6" className="hero-subtitle">
                        כלי הערכה מבוסס על תצפיות קליניות מ-591 מטופלים (2019)
                    </Typography>

                    <Box className="hero-features">
                        <Box className="feature">
                            <CheckIcon color="success" />
                            <Typography>80% תסמינים קליניים</Typography>
                        </Box>
                        <Box className="feature">
                            <CheckIcon color="success" />
                            <Typography>10% תגובה לטיפול</Typography>
                        </Box>
                        <Box className="feature">
                            <CheckIcon color="success" />
                            <Typography>5% ממצאי מעבדה</Typography>
                        </Box>
                    </Box>

                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleStartScale}
                        className="start-button"
                    >
                        התחל הערכה
                    </Button>
                </Paper>

                {/* Info Section */}
                <Paper elevation={2} className="kovacevic-homepage__info">
                    <Typography variant="h5" gutterBottom>
                        על השאלון
                    </Typography>

                    <Typography variant="body1" paragraph>
                        גישה זו לקריטריוני אבחון נובעת מתצפיות שנערכו על כ-591 מטופלים של ד"ר קובאצ'ביץ' (2019).
                        תצפיות אלו סייעו לו להגיע לסוג אחר של קריטריון לאבחון הכולל נוסחה.
                    </Typography>

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="h6" gutterBottom>
                        מבנה האבחון:
                    </Typography>

                    <List>
                        <ListItem>
                            <ListItemIcon>
                                <CheckIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText
                                primary="קריטריון חובה (96.5%)"
                                secondary="התחלה פתאומית של תסמינים מתוך מצב בריאותי תקין"
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <CheckIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText
                                primary="קריטריונים מרכזיים"
                                secondary="OCD, חרדת פרידה, טיקים, הפרעות אכילה"
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <CheckIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText
                                primary="קריטריונים משניים"
                                secondary="הפרעות שינה, נסיגה התנהגותית, בעיות קוגניטיביות ועוד"
                            />
                        </ListItem>
                    </List>

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="h6" gutterBottom>
                        שתי נוסחאות לאבחון:
                    </Typography>

                    <Box className="formula-cards">
                        <Paper elevation={1} className="formula-card">
                            <Typography variant="subtitle1" fontWeight="bold" color="primary">
                                נוסחה מס' 1
                            </Typography>
                            <Typography variant="body2">
                                הופעה פתאומית + קריטריון חובה + 2 קריטריונים מרכזיים
                            </Typography>
                        </Paper>
                        <Paper elevation={1} className="formula-card">
                            <Typography variant="subtitle1" fontWeight="bold" color="secondary">
                                נוסחה מס' 2
                            </Typography>
                            <Typography variant="body2">
                                2 קריטריונים מרכזיים + 3 קריטריונים משניים (לפחות אחד מכל קבוצה)
                            </Typography>
                        </Paper>
                    </Box>
                </Paper>

                {/* Explanation Modal */}
                <Modal open={openExplanation} onClose={handleCloseExplanation}>
                    <Box className="explanation-modal">
                        <Typography variant="h5" gutterBottom className="modal-title">
                            הסבר על שאלון קובאצ'ביץ'
                        </Typography>

                        <Typography variant="body1" paragraph>
                            שאלון זה מבוסס על קריטריוני האבחון שפותחו על ידי ד"ר מירוסלב קובאצ'ביץ' בשנת 2019,
                            בעקבות תצפיות קליניות על 591 מטופלים עם תסמונת פאנס/פאנדס.
                        </Typography>

                        <Typography variant="body1" paragraph>
                            <strong>מבנה האבחון:</strong>
                        </Typography>
                        <List dense>
                            <ListItem>
                                <ListItemText primary="• 80% מהאבחנה מבוססת על תסמינים קליניים" />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="• 10% מהאבחנה מבוססת על תגובה לטיפול (אנטיביוטיקה/סטרואידים)" />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="• 5% מהאבחנה מבוססת על ממצאי מעבדה" />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="• 5% מרווח טעות לאבחון" />
                            </ListItem>
                        </List>

                        <Alert severity="warning" sx={{ my: 3 }}>
                            <Typography variant="body2">
                                <WarningIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                                <strong>הגדרה חשובה:</strong> שאלון זה הינו כלי עזר להערכה בלבד ואינו מהווה
                                תחליף לאבחון רפואי מקצועי. יש להשתמש בתוצאותיו כדי לסייע בניהול שיחה מעמיקה
                                ומבוססת מידע עם איש מקצוע מוסמך.
                            </Typography>
                        </Alert>

                        <Typography variant="body2" color="text.secondary" paragraph>
                            <strong>הערה:</strong> ממצאי מעבדה שליליים אינם שוללים את האבחנה, וממצאים
                            חיוביים אינם מאשרים אותה באופן סופי - הם מהווים רק חלק מהתמונה הכוללת.
                        </Typography>

                        <Box className="modal-buttons">
                            <Button
                                variant="contained"
                                onClick={handleConfirmStart}
                                size="large"
                                endIcon={<ArrowIcon sx={{ transform: 'rotate(180deg)' }} />}
                            >
                                הבנתי, התחל שאלון
                            </Button>
                            <Button variant="outlined" onClick={handleCloseExplanation} size="large">
                                ביטול
                            </Button>
                        </Box>
                    </Box>
                </Modal>
            </Container>
        </Box>
    );
};

export default KovacevicHomePage;
