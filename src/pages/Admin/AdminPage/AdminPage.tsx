import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { FiLogOut, FiMenu, FiX, FiExternalLink } from 'react-icons/fi';
import { useAuth } from '@/Auth/AuthContext';
import { ADMIN_SECTIONS, DEFAULT_TAB, type AdminTabId } from '../adminSections';
import './AdminPage.scss';

const isTab = (v: string | null): v is AdminTabId =>
    ADMIN_SECTIONS.some((s) => s.id === v);

const AdminPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [params, setParams] = useSearchParams();
    const [navOpen, setNavOpen] = useState(false);

    const tabParam = params.get('tab');
    const activeId: AdminTabId = isTab(tabParam) ? tabParam : DEFAULT_TAB;
    const active = ADMIN_SECTIONS.find((s) => s.id === activeId) ?? ADMIN_SECTIONS[0];
    const ActivePanel = active.component;

    const selectTab = (id: AdminTabId) => {
        setParams({ tab: id }, { replace: true });
        setNavOpen(false);
    };

    const handleLogout = async () => {
        await signOut(getAuth());
        navigate('/admin/login', { replace: true });
    };

    return (
        <div className="admin" dir="rtl">
            {/* mobile top bar */}
            <header className="admin__topbar">
                <button
                    type="button"
                    className="admin__burger"
                    onClick={() => setNavOpen((v) => !v)}
                    aria-label={navOpen ? 'סגור תפריט' : 'פתח תפריט'}
                    aria-expanded={navOpen}
                >
                    {navOpen ? <FiX /> : <FiMenu />}
                </button>
                <span className="admin__topbar-title">{active.label}</span>
            </header>

            {/* side nav */}
            <aside className={`admin__nav${navOpen ? ' admin__nav--open' : ''}`}>
                <div className="admin__brand">
                    <span className="admin__brand-title">פאנס/פאנדס ישראל</span>
                    <span className="admin__brand-sub">מערכת ניהול</span>
                </div>

                <nav className="admin__menu" aria-label="ניווט ניהול">
                    {ADMIN_SECTIONS.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            type="button"
                            className={`admin__link${id === activeId ? ' admin__link--active' : ''}`}
                            onClick={() => selectTab(id)}
                            aria-current={id === activeId ? 'page' : undefined}
                        >
                            <Icon />
                            <span>{label}</span>
                        </button>
                    ))}
                </nav>

                <div className="admin__nav-footer">
                    <a href="/" target="_blank" rel="noopener noreferrer" className="admin__link admin__link--muted">
                        <FiExternalLink />
                        <span>לאתר הציבורי</span>
                    </a>
                    {user?.email && <span className="admin__user">{user.email}</span>}
                    <button type="button" className="admin__link admin__link--logout" onClick={handleLogout}>
                        <FiLogOut />
                        <span>התנתקות</span>
                    </button>
                </div>
            </aside>

            {navOpen && (
                <div className="admin__backdrop" onClick={() => setNavOpen(false)} aria-hidden="true" />
            )}

            {/* active panel — key forces a fresh mount when switching */}
            <main className="admin__content" key={activeId}>
                <ActivePanel />
            </main>
        </div>
    );
};

export default AdminPage;