import React, { useState, useRef } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Box, Typography, TextField, Button, IconButton,
    LinearProgress, Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import type PdfEntry from '@/components/professionals/PdfCard/PdfCard';

// ── Cloudinary config ────────────────────────────────────────────────────────
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;

// ── Props ────────────────────────────────────────────────────────────────────
interface AddPdfModalProps {
    open: boolean;
    onClose: () => void;
    onAdded: (entry: PdfEntry) => void;
}

export interface PdfEntry {
    id: string;
    title: string;
    description: string;
    authors: string;
    year: number;
    pdfUrl: string;
    createdAt: any;
}

// ── Component ────────────────────────────────────────────────────────────────
const AddPdfModal: React.FC<AddPdfModalProps> = ({ open, onClose, onAdded }) => {
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [authors, setAuthors] = useState('');
    const [year, setYear] = useState<string>(new Date().getFullYear().toString());
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (!selected) return;
        if (selected.type !== 'application/pdf') {
            setError('יש לבחור קובץ PDF בלבד');
            return;
        }
        if (selected.size > 20 * 1024 * 1024) {
            setError('גודל הקובץ חייב להיות עד 20MB');
            return;
        }
        setError(null);
        setFile(selected);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const dropped = e.dataTransfer.files[0];
        if (dropped?.type === 'application/pdf') {
            setFile(dropped);
            setError(null);
        } else {
            setError('יש לבחור קובץ PDF בלבד');
        }
    };

    const handleSubmit = async () => {
        if (!file || !title.trim() || !description.trim()) {
            setError('שם המסמך ותיאור הם שדות חובה');
            return;
        }

        setUploading(true);
        setProgress(10);
        setError(null);

        try {
            // ── Upload to Cloudinary ──────────────────────────────────────
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', UPLOAD_PRESET);
            formData.append('folder', 'pdfs/articles');
            formData.append('resource_type', 'raw');

            setProgress(30);

            const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`;

            const response = await fetch(cloudinaryUrl, {
                method: 'POST',
                body: formData,
            });

            setProgress(70);

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData?.error?.message || 'שגיאה בהעלאה לשרת');
            }

            const data = await response.json();
            const pdfUrl: string = data.secure_url;

            setProgress(85);

            // ── Save metadata to Firestore ────────────────────────────────
            const db = getFirestore();
            const docRef = await addDoc(collection(db, 'pdf_articles'), {
                title: title.trim(),
                description: description.trim(),
                authors: authors.trim(),
                year: parseInt(year) || new Date().getFullYear(),
                pdfUrl,
                createdAt: serverTimestamp(),
            });

            setProgress(100);

            const newEntry: PdfEntry = {
                id: docRef.id,
                title: title.trim(),
                description: description.trim(),
                authors: authors.trim(),
                year: parseInt(year) || new Date().getFullYear(),
                pdfUrl,
                createdAt: new Date(),
            };

            onAdded(newEntry);
            handleClose();

        } catch (err: any) {
            console.error('Upload error:', err);
            setError(err.message || 'שגיאה בהעלאה. נסה שנית.');
        } finally {
            setUploading(false);
            setProgress(0);
        }
    };

    const handleClose = () => {
        if (uploading) return;
        setFile(null);
        setTitle('');
        setDescription('');
        setAuthors('');
        setYear(new Date().getFullYear().toString());
        setError(null);
        setProgress(0);
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            dir="rtl"
            PaperProps={{ sx: { borderRadius: '16px' } }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                <Typography fontWeight={700} fontSize="1.1rem">הוספת מסמך PDF</Typography>
                <IconButton onClick={handleClose} disabled={uploading} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>

                    {error && (
                        <Alert severity="error" onClose={() => setError(null)}>
                            {error}
                        </Alert>
                    )}

                    {/* Drop Zone */}
                    <Box
                        onDrop={handleDrop}
                        onDragOver={e => e.preventDefault()}
                        onClick={() => fileInputRef.current?.click()}
                        sx={{
                            border: '2px dashed',
                            borderColor: file ? '#2ecc71' : '#023373',
                            borderRadius: '12px',
                            p: 3,
                            textAlign: 'center',
                            cursor: 'pointer',
                            background: file ? '#f0faf4' : '#f8faff',
                            transition: 'all 0.2s',
                            '&:hover': { background: '#eef2ff' },
                        }}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="application/pdf"
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                        {file ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                <PictureAsPdfIcon sx={{ color: '#e74c3c' }} />
                                <Typography fontSize="0.9rem" fontWeight={600}>{file.name}</Typography>
                            </Box>
                        ) : (
                            <>
                                <UploadFileIcon sx={{ fontSize: '2.5rem', color: '#023373', mb: 1 }} />
                                <Typography fontWeight={600} color="#023373">גרור קובץ PDF לכאן</Typography>
                                <Typography fontSize="0.8rem" color="text.secondary">או לחץ לבחירת קובץ (עד 20MB)</Typography>
                            </>
                        )}
                    </Box>

                    {/* Upload progress */}
                    {uploading && (
                        <Box>
                            <LinearProgress variant="determinate" value={progress} sx={{ borderRadius: 4, height: 6 }} />
                            <Typography fontSize="0.8rem" color="text.secondary" textAlign="center" mt={0.5}>
                                מעלה... {progress}%
                            </Typography>
                        </Box>
                    )}

                    {/* Form fields */}
                    <TextField
                        label="שם המסמך *"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        fullWidth
                        disabled={uploading}
                        size="small"
                    />
                    <TextField
                        label="תיאור קצר *"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        fullWidth
                        multiline
                        rows={3}
                        disabled={uploading}
                        size="small"
                    />
                    <TextField
                        label="מחברים"
                        value={authors}
                        onChange={e => setAuthors(e.target.value)}
                        fullWidth
                        disabled={uploading}
                        size="small"
                        placeholder="שם המחבר, שם המחבר..."
                    />
                    <TextField
                        label="שנת פרסום"
                        value={year}
                        onChange={e => setYear(e.target.value)}
                        type="number"
                        fullWidth
                        disabled={uploading}
                        size="small"
                        inputProps={{ min: 1900, max: new Date().getFullYear() }}
                    />
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
                <Button onClick={handleClose} disabled={uploading} color="inherit">
                    ביטול
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={uploading || !file || !title.trim() || !description.trim()}
                    sx={{
                        background: '#023373',
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 600,
                        '&:hover': { background: '#01255a' },
                    }}
                >
                    {uploading ? 'מעלה...' : 'העלה מסמך'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddPdfModal;
export type { PdfEntry };