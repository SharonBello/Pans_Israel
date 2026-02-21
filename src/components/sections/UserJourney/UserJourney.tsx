import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    HelpOutline as SuspectIcon,
    FamilyRestroom as DiagnosedIcon,
    LocalHospital as ProfIcon,
    Search as SymptomsIcon,
    Biotech as DiagnosisIcon,
    Medication as TreatmentIcon,
    MedicalServices as DoctorsIcon,
    Spa as HolisticIcon,
    Groups as SupportIcon,
    Science as ResearchIcon,
    School as EducationIcon,
    Article as ArticlesIcon,
    Language as InternationalIcon,
    BarChart as SurveysIcon,
    ArrowBack as BackIcon,
    East as ArrowIcon,
} from '@mui/icons-material';
import './UserJourney.scss';

const SuspectPanel: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const navigate = useNavigate();
    return (
        <div className="uj-panel" dir="rtl">
            <button className="uj-panel__back" onClick={onBack}><BackIcon fontSize="small" /> חזרה</button>
            <p className="uj-panel__subtitle">בחרו את הצעד הבא עבורכם:</p>
            <div className="uj-panel__grid">
                <button className="uj-panel__card" data-color="blue" onClick={() => navigate('/info/symptoms')}>
                    <div className="uj-panel__card-icon-wrap"><SymptomsIcon /></div>
                    <span className="uj-panel__card-title">תסמינים נפוצים</span>
                    <span className="uj-panel__card-desc">רשימת התסמינים האופייניים לפאנס/פאנדס</span>
                </button>
                <button className="uj-panel__card" data-color="teal" onClick={() => navigate('/info/diagnosis')}>
                    <div className="uj-panel__card-icon-wrap"><DiagnosisIcon /></div>
                    <span className="uj-panel__card-title">תהליך האבחון</span>
                    <span className="uj-panel__card-desc">איך מאבחנים? מה לצפות מהרופא?</span>
                </button>
            </div>
        </div>
    );
};

const DiagnosedPanel: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const navigate = useNavigate();
    const options = [
        { Icon: TreatmentIcon, title: 'דרכי טיפול', desc: 'טיפולים מקובלים ופרוטוקולים', path: '/info/treatment', color: 'navy' },
        { Icon: DoctorsIcon, title: 'רופאים ומטפלים', desc: 'מצאו מומחה בקרבתכם', path: '/Professionals-help', color: 'blue' },
        { Icon: HolisticIcon, title: 'רפואה משלימה', desc: 'גישות אינטגרטיביות', path: '/Professionals-help?tab=holistic', color: 'teal' },
        { Icon: SupportIcon, title: 'תמיכה וקהילה', desc: 'הורים שעברו את זה לפניכם', path: '/support', color: 'warm' },
    ];
    return (
        <div className="uj-panel" dir="rtl">
            <button className="uj-panel__back" onClick={onBack}><BackIcon fontSize="small" /> חזרה</button>
            <p className="uj-panel__subtitle">מה תרצו לחקור?</p>
            <div className="uj-panel__grid uj-panel__grid--4">
                {options.map(o => (
                    <button key={o.path} className="uj-panel__card" data-color={o.color} onClick={() => navigate(o.path)}>
                        <div className="uj-panel__card-icon-wrap"><o.Icon /></div>
                        <span className="uj-panel__card-title">{o.title}</span>
                        <span className="uj-panel__card-desc">{o.desc}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

const ProfessionalPanel: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const navigate = useNavigate();
    const options = [
        { Icon: DiagnosisIcon, title: 'אבחון וטיפול', desc: 'קריטריונים ופרוטוקולים', path: '/professional/diagnosis', color: 'navy' },
        { Icon: EducationIcon, title: 'צוות חינוכי', desc: 'כלים למורים ויועצים', path: '/professional/education', color: 'blue' },
        { Icon: ArticlesIcon, title: 'מאמרים מדעיים', desc: 'ספרות מחקרית עדכנית', path: '/professional/articles', color: 'teal' },
        { Icon: InternationalIcon, title: 'אתרים בינלאומיים', desc: 'ארגונים ומשאבים עולמיים', path: '/professional/international', color: 'warm' },
        { Icon: ResearchIcon, title: 'מחקרים קליניים', desc: 'ניסויים פעילים ורישום', path: '/professional/research', color: 'navy' },
        { Icon: SurveysIcon, title: 'סקרים', desc: 'נתוני קהילה ישראלית', path: '/professional/surveys', color: 'blue' },
    ];
    return (
        <div className="uj-panel" dir="rtl">
            <button className="uj-panel__back" onClick={onBack}><BackIcon fontSize="small" /> חזרה</button>
            <p className="uj-panel__subtitle">בחרו נושא:</p>
            <div className="uj-panel__grid uj-panel__grid--3">
                {options.map(o => (
                    <button key={o.path} className="uj-panel__card" data-color={o.color} onClick={() => navigate(o.path)}>
                        <div className="uj-panel__card-icon-wrap"><o.Icon /></div>
                        <span className="uj-panel__card-title">{o.title}</span>
                        <span className="uj-panel__card-desc">{o.desc}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

type JourneyStep = 'root' | 'suspect' | 'diagnosed' | 'professional';

const JOURNEY_OPTIONS = [
    {
        id: 'suspect' as JourneyStep,
        Icon: SuspectIcon,
        label: 'אני חושד/ת שלילד/ה שלי יש פאנס או פאנדס',
        desc: 'רוצים לבדוק אם התסמינים מתאימים?',
        mod: 'blue',
    },
    {
        id: 'diagnosed' as JourneyStep,
        Icon: DiagnosedIcon,
        label: 'אני הורה לילד/ה מאובחנ/ת',
        desc: 'מחפשים מידע על טיפול ותמיכה?',
        mod: 'navy',
    },
    {
        id: 'professional' as JourneyStep,
        Icon: ProfIcon,
        label: 'אני איש מקצוע',
        desc: 'מידע קליני, מחקרי וחינוכי',
        mod: 'teal',
    },
];

const UserJourney: React.FC = () => {
    const [step, setStep] = useState<JourneyStep>('root');

    return (
        <section className="user-journey" dir="rtl">
            <div className="user-journey__container">
                <div className="user-journey__wrapper">
                    {step === 'root' && (
                        <div className="user-journey__cards">
                            {JOURNEY_OPTIONS.map(opt => (
                                <button
                                    key={opt.id}
                                    className={`uj-root-card uj-root-card--${opt.mod}`}
                                    onClick={() => setStep(opt.id)}
                                >
                                    {/* TOP: centered icon */}
                                    <div className="uj-root-card__icon-area">
                                        <opt.Icon className="uj-root-card__icon" />
                                    </div>

                                    {/* MIDDLE: color block with label text */}
                                    <div className="uj-root-card__block">
                                        <span className="uj-root-card__label">{opt.label}</span>
                                    </div>

                                    {/* BOTTOM: description */}
                                    <div className="uj-root-card__footer" data-label={opt.label}>
                                        <span className="uj-root-card__desc">{opt.desc}</span>
                                        <ArrowIcon className="uj-root-card__arrow" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {step !== 'root' && (
                        <div className="user-journey__panel-wrap">
                            {step === 'suspect' && <SuspectPanel onBack={() => setStep('root')} />}
                            {step === 'diagnosed' && <DiagnosedPanel onBack={() => setStep('root')} />}
                            {step === 'professional' && <ProfessionalPanel onBack={() => setStep('root')} />}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default UserJourney;