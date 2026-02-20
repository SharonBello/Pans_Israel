import React from 'react';
import { Box, Container } from '@mui/material';
import { Language as InternationalIcon } from '@mui/icons-material';
import '../ProfessionalPage.scss';
import { ProfHero } from '../SharedComponents/ProfHero';
import ProfessionalTabs from '@/components/professionals/ProfessionalTabs/ProfessionalTabs';
import { LinkCard } from '../SharedComponents/LinkCard';
import { SectionWrapper } from '../SharedComponents/SectionWrapper';

// Merged: original InternationalPage + resourcesContent websites section
const INTL_SITES = [
    {
        region: '🇺🇸 ארצות הברית',
        sites: [
            { name: 'Neuroimmune Foundation', desc: 'הארגון המוביל למחקר וחינוך על PANS/PANDAS — משאבים לרופאים ומשפחות', url: 'https://neuroimmune.org', tag: 'מוביל' },
            { name: 'PANDAS Network', desc: 'אחד הארגונים הוותיקים ביותר — גישה נרחבת לתוכן, כנסים ומחקרים', url: 'https://pandasnetwork.org', tag: 'ותיק' },
            { name: 'PANDAS Physicians Network (PPN)', desc: 'PPN מוקדש לעזור לאנשי מקצוע רפואיים להבין טוב יותר את פאנס/פאנדס דרך מידע בזמן אמת ונטוורקינג', url: 'https://www.pandasppn.org', tag: 'קליני' },
            { name: 'ASPIRE — A Strep Preventive Initiative', desc: 'המשימה של Aspire היא לשפר את חייהם של ילדים ומבוגרים המושפעים מ-פאנס/פאנדס', url: 'https://aspire.care', tag: 'משפחות' },
            { name: 'Stanford PANS Program', desc: 'תכנית המחקר של Stanford — פרסומים, פרוטוקולים ופרטי קשר לרופאים', url: 'https://med.stanford.edu/pans.html', tag: 'אקדמי' },
            { name: 'NIH — National Institute of Mental Health', desc: 'סוכנות המחקר הפדרלית המובילה להפרעות נפשיות — דפי המידע הרשמיים על PANDAS ו-PANS', url: 'https://www.nimh.nih.gov/health/publications/pandas', tag: 'ממשלתי' },
            { name: 'New England PANS/PANDAS Association', desc: 'קבוצת הורים ומתנדבים רפואיים ממדינות שונות ברחבי ניו אינגלנד המתמקדת בהעלאת מודעות', url: 'https://nepans.org/', tag: 'קהילה' },
            { name: 'Northwest PANS/PANDAS Network', desc: 'עמותה המשרתת את אלה במערב צפון אמריקה עם פאנס/פאנדס/AE ומשפחותיהם', url: 'https://www.nwppn.org/', tag: 'קהילה' },
            { name: 'International OCD Foundation', desc: 'המשימה היא לעזור לכל מי שמושפע מ-OCD והפרעות קשורות', url: 'https://iocdf.org/', tag: 'OCD' },
            { name: 'Immune Deficiency Foundation', desc: 'קרן חסר החיסון משפרת את האבחון, הטיפול ואיכות החיים', url: 'https://primaryimmune.org/', tag: 'חיסון' },
        ]
    },
    {
        region: '🇬🇧 בריטניה',
        sites: [
            { name: 'PANS PANDAS UK', desc: 'עמותה בריטית שהוקמה על ידי קבוצת הורים מסורה — מדריכים, תמיכה, חינוך ורשימת מומחים', url: 'https://panspandasuk.org', tag: 'לאומי' },
            { name: 'PANS PANDAS UK — Education Hub', desc: 'חומרים מיוחדים לצוות חינוכי — מדריכים, סרטונים ותסריטים', url: 'https://panspandasuk.org/education/', tag: 'חינוך' },
        ]
    },
    {
        region: '🌍 בינלאומי',
        sites: [
            { name: 'SANE — PANDAS Sweden', desc: 'ארגון זה מציע רשת תמיכה בחברות למטופלים ומשפחותיהם בשבדיה', url: 'https://sane.nu/', tag: 'שבדיה' },
            { name: 'Inflamed Brain Alliance (קנדה)', desc: 'ברית המוח הדלוק שואפת להקל על הנטל על ידי עזרה בניווט מסלולים לטיפול קליני', url: 'https://inflamedbrain.org/', tag: 'קנדה' },
            { name: 'PANDAS Italia', desc: 'PANDAS Italia ODV — ארגון התנדבותי שנולד באמפולי באוגוסט 2010', url: 'https://pandasitalia.it/', tag: 'איטליה' },
            { name: 'PANDAS Poland', desc: 'אתר ובלוג המנוהלים על ידי אם מסורה לשיתוף מידע על פאנדס, פאנס ותסמיני ASD', url: 'https://www.facebook.com/pandaspansPL/', tag: 'פולין' },
            { name: 'Moleculera Labs — Cunningham Panel', desc: 'מעבדה לבדיקת נוגדנים אנטי-נוירונליים — הזמנת בדיקות', url: 'https://www.moleculeralabs.com', tag: 'אבחון' },
            { name: 'IVIG Global — Treatment Registry', desc: 'מרשם טיפולי IVIG עולמי — מעקב אחר תוצאות', url: 'https://aspire.care/ivig-global/', tag: 'מרשם' },
        ]
    },
];

export const InternationalPage: React.FC = () => (
    <Box className="professional-page" dir="rtl">
        <ProfHero
            icon={<InternationalIcon />}
            label="מידע מקצועי"
            title="אתרים בינלאומיים"
            desc="ארגונים, מוסדות מחקר ומשאבים ממדינות שונות — העולם כולו עובד על PANDAS/PANS"
        />
        <ProfessionalTabs />
        <Container maxWidth="lg" sx={{ py: 5 }}>
            {INTL_SITES.map(group => (
                <SectionWrapper key={group.region} title={group.region}>
                    <Box className="prof-links-grid">
                        {group.sites.map(s => (
                            <LinkCard key={s.name} title={s.name} desc={s.desc} url={s.url} tag={s.tag} />
                        ))}
                    </Box>
                </SectionWrapper>
            ))}
        </Container>
    </Box>
);

export default InternationalPage;