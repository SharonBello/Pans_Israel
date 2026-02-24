import React, { useState, useEffect } from 'react';
import {
    Box, Container, Typography, Button, Divider, CircularProgress,
} from '@mui/material';
import {
    PictureAsPdf as PdfIcon,
    Add as AddIcon,
    AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';
import {
    getFirestore, collection, query, orderBy, getDocs, deleteDoc, doc,
} from 'firebase/firestore';
import { getStorage, ref as storageRef, deleteObject } from 'firebase/storage';
import { useAuth } from '@/Auth/AuthContext';
import AdminLogoutButton from '@/pages/AdminLoginPage/AdminLogoutButton';
import './PdfAdminPage.scss';
import type { PdfEntry } from '@/components/professionals/AddPdfModal/AddPdfModal';
import PdfCard from '@/components/professionals/PdfCard/PdfCard';
import AddPdfModal from '@/components/professionals/AddPdfModal/AddPdfModal';

const PdfAdminPage: React.FC = () => {
    const { user } = useAuth();
    const [pdfs, setPdfs] = useState<PdfEntry[]>([]);
    const [loadingPdfs, setLoadingPdfs] = useState(true);
    const [addModalOpen, setAddModalOpen] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const db = getFirestore();
                const q = query(collection(db, 'pdf_articles'), orderBy('createdAt', 'desc'));
                const snap = await getDocs(q);
                setPdfs(snap.docs.map(d => ({ id: d.id, ...d.data() } as PdfEntry)));
            } catch (err) {
                console.error('Failed to load PDFs:', err);
            } finally {
                setLoadingPdfs(false);
            }
        };
        load();
    }, []);

    const handlePdfAdded = (pdf: PdfEntry) => setPdfs(prev => [pdf, ...prev]);

    const handlePdfDelete = async (id: string) => {
        if (!window.confirm('האם למחוק את המסמך לצמיתות?')) return;
        try {
            const db = getFirestore();
            const entry = pdfs.find(p => p.id === id);
            await deleteDoc(doc(db, 'pdf_articles', id));
            if (entry?.pdfUrl) {
                try {
                    const storage = getStorage();
                    const urlParts = decodeURIComponent(entry.pdfUrl).split('/o/')[1];
                    if (urlParts) await deleteObject(storageRef(storage, urlParts.split('?')[0]));
                } catch { /* non-critical */ }
            }
            setPdfs(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            alert('שגיאה במחיקה. נסה שנית.');
        }
    };

    return (
        <Box className="admin-page" dir="rtl">
            <Box className="admin-page__header">
                <Container maxWidth="lg">
                    <Box className="admin-page__header-inner">
                        <Box className="admin-page__header-title">
                            <AdminIcon />
                            <Box>
                                <Typography className="admin-page__title">לוח ניהול</Typography>
                                <Typography className="admin-page__user">{user?.email}</Typography>
                            </Box>
                        </Box>
                        <AdminLogoutButton />
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box className="admin-page__section">
                    <Box className="admin-page__section-header">
                        <Box className="admin-page__section-title-wrap">
                            <PdfIcon className="admin-page__section-icon" />
                            <Typography className="admin-page__section-title">מסמכי PDF</Typography>
                            <Typography className="admin-page__section-count">
                                {loadingPdfs ? '...' : pdfs.length}
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setAddModalOpen(true)}
                            className="admin-page__add-btn"
                        >
                            הוסף מסמך
                        </Button>
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    {loadingPdfs ? (
                        <Box className="admin-page__loading">
                            <CircularProgress size={32} />
                        </Box>
                    ) : pdfs.length === 0 ? (
                        <Box className="admin-page__empty">
                            <PdfIcon />
                            <Typography>אין מסמכים עדיין</Typography>
                            <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setAddModalOpen(true)}>
                                הוסף את הראשון
                            </Button>
                        </Box>
                    ) : (
                        <Box className="admin-page__pdf-cards">
                            {pdfs.map(pdf => (
                                <PdfCard
                                    key={pdf.id}
                                    title={pdf.title}
                                    description={pdf.description}
                                    authors={pdf.authors}
                                    year={pdf.year}
                                    pdfUrl={pdf.pdfUrl}
                                    isAdmin={true}
                                    onDelete={() => handlePdfDelete(pdf.id)}
                                />
                            ))}
                        </Box>
                    )}
                </Box>
            </Container>

            <AddPdfModal
                open={addModalOpen}
                onClose={() => setAddModalOpen(false)}
                onAdded={handlePdfAdded}
            />
        </Box>
    );
};

export default PdfAdminPage;