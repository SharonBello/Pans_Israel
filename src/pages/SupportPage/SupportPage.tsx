import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Button,
  TextField,
  MenuItem,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Grid,
} from '@mui/material';
import {
  WhatsApp as WhatsAppIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  VideoCall as ZoomIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Favorite as HeartIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Groups as GroupsIcon,
} from '@mui/icons-material';
import {
  getApprovedVolunteers,
  addVolunteer,
  generateWhatsAppLink,
  generateEmailLink,
} from '../../services/supportService';
import type {
  SupportVolunteer,
  SupportVolunteerFormData,
} from '../../types/support.types';
import {
  initialFormData,
  genderOptions,
  religiousOptions,
  religionOptions,
  educationOptions,
  contactPreferenceOptions,
} from '../../types/support.types';
import './SupportPage.scss';

const SupportPage: React.FC = () => {
  // State
  const [volunteers, setVolunteers] = useState<SupportVolunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState<SupportVolunteerFormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'info' });

  // Fetch volunteers on mount
  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    setLoading(true);
    const data = await getApprovedVolunteers();
    setVolunteers(data);
    setLoading(false);
  };

  // Form handlers
  const handleInputChange = (field: keyof SupportVolunteerFormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: event.target.value }));
    setFormErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSelectChange = (field: keyof SupportVolunteerFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: event.target.value }));
    setFormErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleCheckboxChange = (value: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => {
      const current = prev.contactPreference;
      if (event.target.checked) {
        return { ...prev, contactPreference: [...current, value] };
      } else {
        return { ...prev, contactPreference: current.filter(v => v !== value) };
      }
    });
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.firstName.trim()) errors.firstName = 'שדה חובה';
    if (!formData.lastName.trim()) errors.lastName = 'שדה חובה';
    if (!formData.age || parseInt(formData.age) < 18) errors.age = 'גיל מינימלי 18';
    if (!formData.gender) errors.gender = 'שדה חובה';
    if (!formData.profession.trim()) errors.profession = 'שדה חובה';
    if (!formData.location.trim()) errors.location = 'שדה חובה';
    if (!formData.howToHelp.trim()) errors.howToHelp = 'שדה חובה';
    if (formData.contactPreference.length === 0) errors.contactPreference = 'בחר לפחות אפשרות אחת';
    
    // At least one contact method required
    if (!formData.phone && !formData.email) {
      errors.phone = 'נדרש טלפון או אימייל';
      errors.email = 'נדרש טלפון או אימייל';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    const result = await addVolunteer(formData);
    setSubmitting(false);

    if (result.success) {
      setSnackbar({
        open: true,
        message: 'תודה רבה! הפרטים נשלחו ויאושרו בקרוב',
        severity: 'success',
      });
      setFormOpen(false);
      setFormData(initialFormData);
    } else {
      setSnackbar({
        open: true,
        message: result.error || 'אירעה שגיאה, נסה שוב',
        severity: 'error',
      });
    }
  };

  // Contact preference icons
  const getContactIcon = (preference: string) => {
    switch (preference) {
      case 'phone': return <PhoneIcon fontSize="small" />;
      case 'whatsapp': return <WhatsAppIcon fontSize="small" />;
      case 'zoom': return <ZoomIcon fontSize="small" />;
      case 'email': return <EmailIcon fontSize="small" />;
      default: return <PersonIcon fontSize="small" />;
    }
  };

  const getContactLabel = (preference: string) => {
    const option = contactPreferenceOptions.find(o => o.value === preference);
    return option?.label || preference;
  };

  return (
    <Box className="support-page" dir="rtl">
      {/* Hero Section */}
      <section className="support-page__hero">
        <div className="support-page__hero-bg" />
        <div className="support-page__hero-overlay" />
        <Container maxWidth="lg" className="support-page__hero-content">
          <Box className="support-page__hero-icon">
            <HeartIcon />
          </Box>
          <Typography variant="h1" className="support-page__hero-title">
            אתם לא לבד
          </Typography>
          <Typography className="support-page__hero-subtitle">
            כל שאלה והתלבטות - אנחנו כאן בשבילכם
          </Typography>
          <p className="support-page__hero-description">
            קהילת הורים ואנשי מקצוע שעברו את הדרך ומוכנים לתמוך, להקשיב ולעזור
          </p>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="support-page__stats">
        <Container maxWidth="lg">
          <Box className="support-page__stats-grid">
            <Box className="support-page__stat">
              <GroupsIcon className="support-page__stat-icon" />
              <Typography className="support-page__stat-number">
                {volunteers.length}+
              </Typography>
              <Typography className="support-page__stat-label">
                מתנדבים פעילים
              </Typography>
            </Box>
            <Box className="support-page__stat">
              <HeartIcon className="support-page__stat-icon" />
              <Typography className="support-page__stat-number">
                24/7
              </Typography>
              <Typography className="support-page__stat-label">
                תמיכה זמינה
              </Typography>
            </Box>
            <Box className="support-page__stat">
              <PersonIcon className="support-page__stat-icon" />
              <Typography className="support-page__stat-number">
                100%
              </Typography>
              <Typography className="support-page__stat-label">
                התנדבותי
              </Typography>
            </Box>
          </Box>
        </Container>
      </section>

      {/* Volunteers Grid */}
      <section className="support-page__volunteers">
        <Container maxWidth="lg">
          <Box className="support-page__section-header">
            <Typography variant="h2" className="support-page__section-title">
              המתנדבים שלנו
            </Typography>
            <Typography className="support-page__section-subtitle">
              הורים ואנשי מקצוע שמבינים ורוצים לעזור
            </Typography>
          </Box>

          {loading ? (
            <Box className="support-page__loading">
              <CircularProgress />
              <Typography>טוען מתנדבים...</Typography>
            </Box>
          ) : volunteers.length === 0 ? (
            <Box className="support-page__empty">
              <Typography>עדיין אין מתנדבים רשומים</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setFormOpen(true)}
              >
                היה הראשון להתנדב
              </Button>
            </Box>
          ) : (
            <Grid container spacing={3} className="support-page__grid">
              {volunteers.map((volunteer) => (
                <Grid sx={{xs:12, sm:6, md:4}} key={volunteer.id}>
                  <Card className="support-page__card">
                    <CardContent className="support-page__card-content">
                      {/* Header */}
                      <Box className="support-page__card-header">
                        <Avatar className="support-page__card-avatar">
                          {volunteer.firstName[0]}
                          {volunteer.lastName[0]}
                        </Avatar>
                        <Box className="support-page__card-name-wrap">
                          <Typography className="support-page__card-name">
                            {volunteer.firstName} {volunteer.lastName}
                          </Typography>
                          <Typography className="support-page__card-profession">
                            {volunteer.profession}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Info */}
                      <Box className="support-page__card-info">
                        <Box className="support-page__card-info-item">
                          <LocationIcon fontSize="small" />
                          <Typography>{volunteer.location}</Typography>
                        </Box>
                        <Box className="support-page__card-info-item">
                          <SchoolIcon fontSize="small" />
                          <Typography>
                            {educationOptions.find(e => e.value === volunteer.education)?.label || volunteer.education}
                          </Typography>
                        </Box>
                      </Box>

                      {/* How they help */}
                      <Typography className="support-page__card-help">
                        "{volunteer.howToHelp}"
                      </Typography>

                      {/* Contact Preferences */}
                      <Box className="support-page__card-preferences">
                        {volunteer.contactPreference.map((pref) => (
                          <Chip
                            key={pref}
                            icon={getContactIcon(pref)}
                            label={getContactLabel(pref)}
                            size="small"
                            className="support-page__card-chip"
                          />
                        ))}
                      </Box>

                      {/* Contact Buttons */}
                      <Box className="support-page__card-actions">
                        {volunteer.phone && (
                          <Tooltip title="שלח הודעת WhatsApp">
                            <IconButton
                              className="support-page__contact-btn support-page__contact-btn--whatsapp"
                              href={generateWhatsAppLink(
                                volunteer.phone,
                                `שלום ${volunteer.firstName}, פניתי אליך דרך אתר פאנס/פאנדס ישראל`
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <WhatsAppIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        {volunteer.email && (
                          <Tooltip title="שלח אימייל">
                            <IconButton
                              className="support-page__contact-btn support-page__contact-btn--email"
                              href={generateEmailLink(
                                volunteer.email,
                                'פנייה מאתר פאנס/פאנדס ישראל',
                                `שלום ${volunteer.firstName},\n\nפניתי אליך דרך אתר פאנס/פאנדס ישראל.\n\n`
                              )}
                            >
                              <EmailIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        {volunteer.phone && (
                          <Tooltip title="התקשר">
                            <IconButton
                              className="support-page__contact-btn support-page__contact-btn--phone"
                              href={`tel:${volunteer.phone}`}
                            >
                              <PhoneIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Join CTA */}
          <Box className="support-page__cta">
            <Typography variant="h3" className="support-page__cta-title">
              רוצים להצטרף לצוות המתנדבים?
            </Typography>
            <p className="support-page__cta-text">
              אם עברתם את הדרך ורוצים לעזור למשפחות אחרות, נשמח שתצטרפו אלינו
            </p>
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={() => setFormOpen(true)}
              className="support-page__cta-btn"
            >
              הצטרפו כמתנדבים
            </Button>
          </Box>
        </Container>
      </section>

      {/* Volunteer Form Dialog */}
      <Dialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        maxWidth="md"
        fullWidth
        className="support-page__dialog"
        dir="rtl"
      >
        <DialogTitle className="support-page__dialog-title">
          <HeartIcon />
          הצטרפות כמתנדב/ת
          <IconButton
            onClick={() => setFormOpen(false)}
            className="support-page__dialog-close"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent className="support-page__dialog-content">
          <Typography className="support-page__dialog-intro">
            תודה שבחרתם להתנדב! מלאו את הפרטים הבאים ונחזור אליכם בהקדם
          </Typography>

          <Grid container spacing={2}>
            {/* Personal Info */}
            <Grid sx={{xs:12, sm:6}}>
              <TextField
                label="שם פרטי"
                value={formData.firstName}
                onChange={handleInputChange('firstName')}
                error={!!formErrors.firstName}
                helperText={formErrors.firstName}
                fullWidth
                required
              />
            </Grid>
            <Grid sx={{xs:12, sm:6}}>
              <TextField
                label="שם משפחה"
                value={formData.lastName}
                onChange={handleInputChange('lastName')}
                error={!!formErrors.lastName}
                helperText={formErrors.lastName}
                fullWidth
                required
              />
            </Grid>
            <Grid sx={{xs:12, sm:6}}>
              <TextField
                label="גיל"
                type="number"
                value={formData.age}
                onChange={handleInputChange('age')}
                error={!!formErrors.age}
                helperText={formErrors.age}
                fullWidth
                required
                inputProps={{ min: 18 }}
              />
            </Grid>
            <Grid sx={{xs:12, sm:6}}>
              <TextField
                select
                label="מגדר"
                value={formData.gender}
                onChange={handleSelectChange('gender')}
                error={!!formErrors.gender}
                helperText={formErrors.gender}
                fullWidth
                required
              >
                {genderOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Background */}
            <Grid sx={{xs:12, sm:6}}>
              <TextField
                select
                label="קרבה לדת"
                value={formData.religiousAffiliation}
                onChange={handleSelectChange('religiousAffiliation')}
                fullWidth
              >
                {religiousOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid sx={{xs:12, sm:6}}>
              <TextField
                select
                label="דת"
                value={formData.religion}
                onChange={handleSelectChange('religion')}
                fullWidth
              >
                {religionOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Professional */}
            <Grid sx={{xs:12, sm:6}}>
              <TextField
                label="מקצוע / תחום עיסוק"
                value={formData.profession}
                onChange={handleInputChange('profession')}
                error={!!formErrors.profession}
                helperText={formErrors.profession}
                fullWidth
                required
              />
            </Grid>
            <Grid sx={{xs:12, sm:6}}>
              <TextField
                select
                label="השכלה"
                value={formData.education}
                onChange={handleSelectChange('education')}
                fullWidth
              >
                {educationOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Location */}
            <Grid sx={{xs:12}}>
              <TextField
                label="מקום מגורים"
                value={formData.location}
                onChange={handleInputChange('location')}
                error={!!formErrors.location}
                helperText={formErrors.location}
                fullWidth
                required
                placeholder="עיר / אזור"
              />
            </Grid>

            {/* How to help */}
            <Grid sx={{xs:12}}>
              <TextField
                label="כיצד תרצה/י לעזור?"
                value={formData.howToHelp}
                onChange={handleInputChange('howToHelp')}
                error={!!formErrors.howToHelp}
                helperText={formErrors.howToHelp}
                fullWidth
                required
                multiline
                rows={3}
                placeholder="תאר/י במה תוכל/י לסייע (אוזן קשבת, עצה מקצועית, ליווי וכו')"
              />
            </Grid>

            {/* Contact Preferences */}
            <Grid sx={{xs:12}}>
              <FormControl error={!!formErrors.contactPreference} component="fieldset">
                <FormLabel component="legend">באיזו דרך מתאים ליצור קשר? *</FormLabel>
                <FormGroup row>
                  {contactPreferenceOptions.map(option => (
                    <FormControlLabel
                      key={option.value}
                      control={
                        <Checkbox
                          checked={formData.contactPreference.includes(option.value)}
                          onChange={handleCheckboxChange(option.value)}
                        />
                      }
                      label={option.label}
                    />
                  ))}
                </FormGroup>
                {formErrors.contactPreference && (
                  <Typography color="error" variant="caption">
                    {formErrors.contactPreference}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Contact Info */}
            <Grid sx={{xs:12, sm:6}}>
              <TextField
                label="טלפון"
                value={formData.phone}
                onChange={handleInputChange('phone')}
                error={!!formErrors.phone}
                helperText={formErrors.phone || 'לווטסאפ ושיחות'}
                fullWidth
                placeholder="050-1234567"
                dir="ltr"
              />
            </Grid>
            <Grid sx={{xs:12, sm:6}}>
              <TextField
                label="אימייל"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                error={!!formErrors.email}
                helperText={formErrors.email}
                fullWidth
                placeholder="your@email.com"
                dir="ltr"
              />
            </Grid>
          </Grid>

          <Alert severity="info" className="support-page__dialog-alert">
            הפרטים יעברו אישור לפני הצגתם באתר. פרטי הקשר יוצגו רק למי שמעוניין לפנות אליכם.
          </Alert>
        </DialogContent>

        <DialogActions className="support-page__dialog-actions">
          <Button onClick={() => setFormOpen(false)} disabled={submitting}>
            ביטול
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={20} /> : <HeartIcon />}
          >
            {submitting ? 'שולח...' : 'שלח פרטים'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SupportPage;
