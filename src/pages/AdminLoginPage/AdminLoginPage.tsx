// ==========================================================================
// AdminLoginPage.tsx
// Secure login page for admin area — Hebrew RTL
// Only accessible via direct URL — no links anywhere in the app
// ==========================================================================

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Alert,
    InputAdornment,
    IconButton,
    CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff, Lock } from '@mui/icons-material';
import { useAuth } from '@/Auth/AuthContext';
import './AdminLoginPage.scss';

// --------------------------------------------------------------------------
// Component
// --------------------------------------------------------------------------

const AdminLoginPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, user, loading } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // If already logged in, redirect to the page they tried to visit
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname
        || '/admin/surveys/state-of-children';

    useEffect(() => {
        if (!loading && user) {
            navigate(from, { replace: true });
        }
    }, [user, loading, navigate, from]);

    // --------------------------------------------------------------------------
    // Handlers
    // --------------------------------------------------------------------------

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        try {
            await login(email.trim(), password);
            // onAuthStateChanged in AuthContext will update user → useEffect above will redirect
        } catch (err: any) {
            // Map Firebase error codes to Hebrew messages
            const code = err?.code || '';
            if (
                code === 'auth/user-not-found' ||
                code === 'auth/wrong-password' ||
                code === 'auth/invalid-credential' ||
                code === 'auth/invalid-email'
            ) {
                setError('שם משתמש או סיסמה שגויים');
            } else if (code === 'auth/too-many-requests') {
                setError('יותר מדי ניסיונות התחברות. אנא המתן מעט ונסה שוב');
            } else if (code === 'auth/user-disabled') {
                setError('חשבון זה הושבת');
            } else {
                setError('אירעה שגיאה. אנא נסה שוב');
            }
        } finally {
            setSubmitting(false);
        }
    };

    // --------------------------------------------------------------------------
    // Render
    // --------------------------------------------------------------------------

    if (loading) {
        return (
            <Box className="admin-login__loading">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box className="admin-login" dir="rtl">
            <Box className="admin-login__background" aria-hidden="true">
                <Box className="admin-login__circle admin-login__circle--1" />
                <Box className="admin-login__circle admin-login__circle--2" />
                <Box className="admin-login__circle admin-login__circle--3" />
            </Box>

            <Paper className="admin-login__card" elevation={8}>
                {/* Logo / Icon */}
                <Box className="admin-login__icon-wrap">
                    <Lock className="admin-login__lock-icon" />
                </Box>

                {/* Title */}
                <Typography variant="h5" className="admin-login__title">
                    כניסת מנהל
                </Typography>
                <Typography variant="body2" className="admin-login__subtitle">
                    אזור מוגן — גישה לאנשי צוות מורשים בלבד
                </Typography>

                {/* Error */}
                {error && (
                    <Alert severity="error" className="admin-login__alert" onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                {/* Form */}
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    className="admin-login__form"
                    noValidate
                >
                    <TextField
                        label="דואר אלקטרוני"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        required
                        autoComplete="email"
                        autoFocus
                        disabled={submitting}
                        className="admin-login__field"
                        inputProps={{ dir: 'ltr' }}
                    />

                    <TextField
                        label="סיסמה"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        required
                        autoComplete="current-password"
                        disabled={submitting}
                        className="admin-login__field"
                        inputProps={{ dir: 'ltr' }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword((s) => !s)}
                                        edge="end"
                                        aria-label={showPassword ? 'הסתר סיסמה' : 'הצג סיסמה'}
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                        disabled={submitting || !email || !password}
                        className="admin-login__submit"
                        startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : undefined}
                    >
                        {submitting ? 'מתחבר...' : 'כניסה'}
                    </Button>
                </Box>

                <Typography variant="caption" className="admin-login__footer">
                    לבעיות גישה, פנו למנהל המערכת
                </Typography>
            </Paper>
        </Box>
    );
};

export default AdminLoginPage;