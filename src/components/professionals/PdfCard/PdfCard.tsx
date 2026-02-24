import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, IconButton, Tooltip, Skeleton } from '@mui/material';
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DeleteIcon from '@mui/icons-material/Delete';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DownloadIcon from '@mui/icons-material/Download';

export interface PdfEntry {
    id: string;
    title: string;
    description: string;
    authors: string;
    year: number;
    pdfUrl: string;
    createdAt: any;
}

interface PdfCardProps {
    title: string;
    description: string;
    pdfUrl: string;
    authors?: string;
    year?: number;
    isAdmin?: boolean;
    onDelete?: () => void;
}

const PdfCard: React.FC<PdfCardProps> = ({
    title, description, pdfUrl, authors, year, isAdmin = false, onDelete,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [thumbLoading, setThumbLoading] = useState(true);
    const [thumbError, setThumbError] = useState(false);

    useEffect(() => {
        let cancelled = false;
        const renderThumb = async () => {
            try {
                const pdfjsLib = await import('pdfjs-dist');
                pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;


                // Fetch as ArrayBuffer — avoids canvas CORS tainting
                const response = await fetch(pdfUrl);
                const arrayBuffer = await response.arrayBuffer();

                if (cancelled) return;

                const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                const page = await pdf.getPage(1);

                if (cancelled || !canvasRef.current) return;

                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');
                if (!ctx) return;

                const THUMB_WIDTH = 280;
                const viewport = page.getViewport({ scale: 1 });
                const scale = THUMB_WIDTH / viewport.width;
                const scaled = page.getViewport({ scale });

                canvas.width = scaled.width;
                canvas.height = scaled.height;
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                await page.render({ canvasContext: ctx, viewport: scaled, canvas }).promise;
                if (!cancelled) setThumbLoading(false);
            } catch (err) {
                console.warn('PDF thumbnail error:', err);
                if (!cancelled) { setThumbError(true); setThumbLoading(false); }
            }
        };
        renderThumb();
        return () => { cancelled = true; };
    }, [pdfUrl]);

    return (
        <Box className="prof-pdf-card">
            {/* Thumbnail */}
            <Box className="prof-pdf-card__thumb-wrap">
                {thumbLoading && !thumbError && (
                    <Skeleton variant="rectangular" width="100%" height="100%" animation="wave" />
                )}
                {thumbError && (
                    <Box className="prof-pdf-card__thumb-fallback">
                        <PictureAsPdfIcon />
                    </Box>
                )}
                <canvas
                    ref={canvasRef}
                    className="prof-pdf-card__canvas"
                    style={{ display: thumbLoading || thumbError ? 'none' : 'block' }}
                />
            </Box>

            {/* Info */}
            <Box className="prof-pdf-card__info">
                <Typography className="prof-pdf-card__title">{title}</Typography>
                {(authors || year) && (
                    <Typography className="prof-pdf-card__meta">
                        {authors}{authors && year ? ` · ${year}` : year}
                    </Typography>
                )}
                <Typography className="prof-pdf-card__desc">{description}</Typography>
            </Box>

            {/* Actions */}
            <Box className="prof-pdf-card__actions">
                <a href={pdfUrl} target="_blank" rel="noopener noreferrer"
                    className="prof-pdf-card__btn prof-pdf-card__btn--view">
                    <OpenInNewIcon fontSize="small" />פתח
                </a>
                <a href={pdfUrl} download
                    className="prof-pdf-card__btn prof-pdf-card__btn--download">
                    <DownloadIcon fontSize="small" />הורד
                </a>
                {isAdmin && onDelete && (
                    <Tooltip title="מחק PDF">
                        <IconButton size="small" onClick={onDelete} className="prof-pdf-card__delete-btn">
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>
        </Box>
    );
};

export default PdfCard;