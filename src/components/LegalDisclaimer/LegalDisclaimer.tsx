import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
} from '@mui/material';
import logoPng from '../../styles/assets/logo.png';
import './LegalDisclaimer.scss';

const DISCLAIMER_KEY = 'pans_pandas_legal_accepted';

const LegalDisclaimer: React.FC = () => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const hasAccepted = localStorage.getItem(DISCLAIMER_KEY);
        if (!hasAccepted) {
            setOpen(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem(DISCLAIMER_KEY, 'true');
        setOpen(false);
    };

    return (
        <Dialog
            open={open}
            maxWidth="sm"
            fullWidth
            disableEscapeKeyDown
            className="legal-disclaimer"
            dir="rtl"
        >
            <DialogContent className="legal-disclaimer__content">
                <Box className="legal-disclaimer__header">
                    <img src={logoPng} className="header__logo-icon" alt="logo" />
                    <Typography variant="h5" className="legal-disclaimer__title">
                        פאנס/פאנדס ישראל
                    </Typography>
                </Box>

                <Box className="legal-disclaimer__text">
                    <Typography component="p">
                        אתר זה מיועד למטרות מידע והעלאת מודעות בלבד.
                    </Typography>

                    <Typography component="p">
                        <strong>המידע באתר אינו מהווה ייעוץ רפואי, אבחון או המלצה לטיפול.</strong>
                    </Typography>

                    <Typography component="p">
                        תסמונות פאנס/פאנדס הן מצבים רפואיים מורכבים הדורשים אבחון וטיפול על ידי
                        רופאים מומחים. כל החלטה רפואית חייבת להתקבל בהתייעצות עם איש מקצוע מוסמך.
                    </Typography>

                    <Typography component="p">
                        השימוש באתר הוא באחריותך בלבד. העמותה ומפעילי האתר אינם אחראים לכל נזק
                        ישיר או עקיף הנובע משימוש במידע המופיע באתר.
                    </Typography>

                    <Typography className="legal-disclaimer__emphasis">
                        בלחיצה על "הבנתי ומסכים/ה" הנך מאשר/ת כי קראת והבנת את תנאי השימוש.
                    </Typography>
                </Box>
            </DialogContent>

            <DialogActions className="legal-disclaimer__actions">
                <Button
                    variant="contained"
                    onClick={handleAccept}
                    className="legal-disclaimer__button"
                    fullWidth
                >
                    הבנתי ומסכים/ה
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default LegalDisclaimer;