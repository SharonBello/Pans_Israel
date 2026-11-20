import React, { useState } from 'react';
import { Menu, MenuItem } from '@mui/material';
import { FiCalendar, FiChevronDown, FiDownload, FiExternalLink } from 'react-icons/fi';
import type { EventItem } from '@/types/event';
import { eventAnchorId } from '@/types/event';
import { buildIcs, googleCalendarUrl } from '@/utils/eventCalendar';
import './AddToCalendar.scss';

interface AddToCalendarProps {
    event: EventItem;
}

/** Link back to this event's card, written into the calendar entry */
const eventPageUrl = (event: EventItem): string =>
    `${window.location.origin}/activities#${eventAnchorId(event.id)}`;

const downloadIcs = (event: EventItem): void => {
    const blob = new Blob([buildIcs(event, eventPageUrl(event))], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pans-pandas-${event.date}.ics`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};

/** "הוספה ליומן" button with a menu: Google Calendar, or an .ics file for Apple / Outlook / others */
const AddToCalendar: React.FC<AddToCalendarProps> = ({ event }) => {
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);
    const open = Boolean(anchor);
    const menuId = `${eventAnchorId(event.id)}-calendar`;
    const googleUrl = googleCalendarUrl(event, eventPageUrl(event));
    const close = () => setAnchor(null);

    return (
        <>
            <button
                type="button"
                className="add-to-calendar"
                aria-haspopup="menu"
                aria-expanded={open}
                aria-controls={open ? menuId : undefined}
                onClick={(e) => setAnchor(e.currentTarget)}
            >
                <FiCalendar aria-hidden="true" />
                <span>הוספה ליומן</span>
                <FiChevronDown aria-hidden="true" className="add-to-calendar__chevron" />
            </button>

            <Menu
                id={menuId}
                anchorEl={anchor}
                open={open}
                onClose={close}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                className="add-to-calendar__menu"
            >
                <MenuItem
                    component="a"
                    href={googleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={close}
                >
                    <FiExternalLink aria-hidden="true" />
                    יומן Google
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        downloadIcs(event);
                        close();
                    }}
                >
                    <FiDownload aria-hidden="true" />
                    קובץ יומן (Apple, Outlook ועוד)
                </MenuItem>
            </Menu>
        </>
    );
};

export default AddToCalendar;