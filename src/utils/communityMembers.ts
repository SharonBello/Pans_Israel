// ==========================================================================
// Community members — grouping and CSV export (admin)
// ==========================================================================

import type { CommunityMember } from '@/types/community';

/** One person = one email. Someone who joined twice shows once, with their latest choice. */
export interface MemberGroup {
    email: string;
    latest: CommunityMember;     // newest submission — its name and email-updates choice win
    ids: string[];               // every document for this email (all are deleted together)
    firstJoined: Date | null;
}

export const toDate = (ts: CommunityMember['createdAt']): Date | null => ts?.toDate?.() ?? null;

/** Expects members newest-first (as getCommunityMembers returns them). */
export const groupMembers = (members: CommunityMember[]): MemberGroup[] => {
    const byEmail = new Map<string, MemberGroup>();
    for (const m of members) {
        const key = m.email.trim().toLowerCase();
        const joined = toDate(m.createdAt);
        const group = byEmail.get(key);
        if (!group) {
            byEmail.set(key, { email: key, latest: m, ids: [m.id], firstJoined: joined });
        } else {
            group.ids.push(m.id);
            if (joined && (!group.firstJoined || joined < group.firstJoined)) group.firstJoined = joined;
        }
    }
    return [...byEmail.values()];
};

export const splitName = (fullName: string): { first: string; last: string } => {
    const [first = '', ...rest] = fullName.trim().split(/\s+/);
    return { first, last: rest.join(' ') };
};

/** YYYY-MM-DD in Israel time */
export const isoDay = (d: Date | null): string =>
    d ? d.toLocaleDateString('en-CA', { timeZone: 'Asia/Jerusalem' }) : '';

// ── CSV ─────────────────────────────────────────────────────────────────────

/** Stops Excel from running a cell as a formula (=, +, -, @ at the start) */
const neutralize = (value: string): string => (/^[=+\-@\t\r]/.test(value) ? `'${value}` : value);

const cell = (value: string, guard = true): string =>
    `"${(guard ? neutralize(value) : value).replace(/"/g, '""')}"`;

const toCsv = (rows: string[][]): string => rows.map((r) => r.join(',')).join('\r\n') + '\r\n';

/**
 * Who goes into the mailing-service file: people whose latest choice is "send me updates".
 * `since` ('YYYY-MM-DD', Israel time, inclusive) keeps only people who signed up on or after that day,
 * so each import adds the new members only — and nobody who unsubscribed in the mailing service is added back.
 */
export const mailingRecipients = (groups: MemberGroup[], since?: string | null): MemberGroup[] =>
    groups.filter((g) => g.latest.emailUpdates && (!since || isoDay(toDate(g.latest.createdAt)) >= since));

/**
 * For the mailing service (Resend). Column names match Resend's contact fields,
 * so the import maps them automatically. The email is left exactly as stored.
 */
export const buildMailingCsv = (groups: MemberGroup[], since?: string | null): string => {
    const rows = [['email', 'first_name', 'last_name'].map((h) => cell(h))];
    for (const g of mailingRecipients(groups, since)) {
        const { first, last } = splitName(g.latest.fullName);
        rows.push([cell(g.email, false), cell(first), cell(last)]);
    }
    return toCsv(rows);
};

/** Full list for the NGO's records — opens in Excel with Hebrew intact (the caller adds a BOM). */
export const buildFullCsv = (groups: MemberGroup[]): string => {
    const rows = [['שם מלא', 'אימייל', 'מקבל/ת עדכונים', 'הצטרפות ראשונה', 'נוסח שאושר', 'מספר הרשמות'].map((h) => cell(h))];
    for (const g of groups) {
        rows.push([
            cell(g.latest.fullName),
            cell(g.email),
            cell(g.latest.emailUpdates ? 'כן' : 'לא'),
            cell(isoDay(g.firstJoined)),
            cell(g.latest.noticeVersion ?? ''),
            cell(String(g.ids.length)),
        ]);
    }
    return toCsv(rows);
};

export const downloadCsv = (csv: string, fileName: string, withBom: boolean): void => {
    const blob = new Blob([withBom ? '﻿' + csv : csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
};