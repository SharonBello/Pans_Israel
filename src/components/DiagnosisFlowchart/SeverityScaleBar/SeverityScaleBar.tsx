export const SeverityScaleBar: React.FC = () => (
    <div className="df-severity">
        <div className="df-severity__item df-severity__mild">
            <div className="df-sev-title">🟡 מקרה קל</div>
            <div className="df-sev-desc">תסמינים משמעותיים המפריעים בבית ו/או בבית הספר. נמשכים כמה שעות ביום.</div>
        </div>
        <div className="df-severity__item df-severity__moderate">
            <div className="df-sev-title">🟠 מקרה בינוני</div>
            <div className="df-sev-desc">תסמינים מפריעים לפעילויות היומיומיות. תופסים 50%–70% משעות הערות.</div>
        </div>
        <div className="df-severity__item df-severity__severe">
            <div className="df-sev-title">🔴 מקרה חמור / קיצוני</div>
            <div className="df-sev-desc">תסמינים משביתים, מסכני חיים, או תופסים 71%–100% משעות הערות.</div>
        </div>
    </div>
);