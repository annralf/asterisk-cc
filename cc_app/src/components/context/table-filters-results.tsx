'use client';
import type { Theme, SxProps } from '@mui/material/styles';
import type { UseSetStateReturn } from 'src/hooks/use-set-state';

import { IContextFilters } from './list';

import { useCallback } from 'react';
import Chip from '@mui/material/Chip';
import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

type Props = {
    totalResults: number;
    sx?: SxProps<Theme>;
    onResetPage: () => void;
    filters: UseSetStateReturn<IContextFilters>;
};

export function ContextTableFiltersResult({ filters, totalResults, onResetPage, sx }: Props) {
    const handleRemoveName = useCallback(() => {
        onResetPage();
        filters.setState({ name: '' });
    }, [filters, onResetPage]);

    const handleRemovePermission = useCallback(() => {
        onResetPage();
        filters.setState({ permission: '' });
    }, [filters, onResetPage]);

    const handleRemoveIsActive = useCallback(() => {
        onResetPage();
        filters.setState({ is_active: '' });
    }, [filters, onResetPage]);

    const handleRemoveMonitors = useCallback(() => {
        onResetPage();
        filters.setState({ monitors: '' });
    }, [filters, onResetPage]);

    return (
        <FiltersResult totalResults={totalResults} onReset={filters.onResetState} sx={sx}>
            <FiltersBlock label="Identificador:" isShow={filters.state.name !== ''}>
                <Chip
                    {...chipProps}
                    label={filters.state.name}
                    onDelete={handleRemoveName}
                    sx={{ textTransform: 'capitalize' }}
                />
            </FiltersBlock>
            <FiltersBlock label="Permiso:" isShow={filters.state.permission !== ''}>
                <Chip
                    {...chipProps}
                    label={filters.state.permission}
                    onDelete={handleRemovePermission}
                    sx={{ textTransform: 'capitalize' }}
                />
            </FiltersBlock>
            <FiltersBlock label="Activo:" isShow={filters.state.is_active !== ''}>
                <Chip
                    {...chipProps}
                    label={filters.state.is_active}
                    onDelete={handleRemoveIsActive}
                    sx={{ textTransform: 'capitalize' }}
                />
            </FiltersBlock>
            <FiltersBlock label="Monitores:" isShow={filters.state.monitors !== ''}>
                <Chip
                    {...chipProps}
                    label={filters.state.monitors}
                    onDelete={handleRemoveMonitors}
                    sx={{ textTransform: 'capitalize' }}
                />
            </FiltersBlock>
        </FiltersResult>
    );
}