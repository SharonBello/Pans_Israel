import React, { type JSX } from 'react';
import { Seo } from './Seo';

type SeoRouteProps = {
    title: string;
    description: string;
    path: string;
    noIndex?: boolean;
    children: React.ReactElement;
};

export function SeoRoute({
    title,
    description,
    path,
    noIndex = false,
    children,
}: SeoRouteProps): JSX.Element {
    return (
        <>
            <Seo
                title={title}
                description={description}
                path={path}
                noIndex={noIndex}
            />
            {children}
        </>
    );
}