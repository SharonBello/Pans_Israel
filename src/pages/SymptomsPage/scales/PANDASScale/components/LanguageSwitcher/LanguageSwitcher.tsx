import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';

type Lang = 'en' | 'he' | 'ar-IL' | 'es' | 'pt-BR';
const LANGUAGES: { code: Lang; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'he', label: 'עברית' },
    { code: 'ar-IL', label: 'العربية (إسرائيل)' },
    { code: 'es', label: 'Español' },
    { code: 'pt-BR', label: 'Português (Brasil)' },
];

const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation();
    // initial state from i18n.language or fallback to 'en'
    const [lang, setLang] = useState<Lang>(
        (i18n.language as Lang) || 'en'
    );

    // on mount, check localStorage override
    useEffect(() => {
        const saved = localStorage.getItem('appLang') as Lang | null;
        if (saved && saved !== lang) {
            i18n.changeLanguage(saved);
            setLang(saved);
        }
    }, [i18n, lang]);

    const handleChange = (e: SelectChangeEvent) => {
        const next = e.target.value as Lang;
        i18n.changeLanguage(next);
        setLang(next);
        localStorage.setItem('appLang', next);
    };

    return (
        <FormControl size="small" variant="outlined" sx={{ minWidth: 120 }}>
            <InputLabel id="lang-select-label">שפה / Language</InputLabel>
            <Select
                labelId="lang-select-label"
                value={lang}
                onChange={handleChange}
                label="שפה / Language"
            >
                {LANGUAGES.map(({ code, label }) => (
                    <MenuItem key={code} value={code}>{label}</MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default LanguageSwitcher;
