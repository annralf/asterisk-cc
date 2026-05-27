'use client';
import type { Theme, SxProps } from '@mui/material/styles';
import type { UseSetStateReturn } from 'src/hooks/use-set-state';

import { IServiceFilters } from './list';
import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

// ----------------------------------------------------------------------

type Props = {
  totalResults: number;
  sx?: SxProps<Theme>;
  onResetPage: () => void;
  filters: UseSetStateReturn<IServiceFilters>;
};

export const ServiceTableFiltersResult = ({ filters, totalResults, onResetPage, sx }: Props) => {
    const handleRemoveChannel = useCallback(() => {
      onResetPage();
      filters.setState({ channel: '' });
    }, [onResetPage, filters]);

    const handleRemoveClientNames = useCallback(() => {
      onResetPage();
      filters.setState({ clientNames: '' });
    }, [onResetPage, filters]);

    const handleRemoveClientId = useCallback(() => {
      onResetPage();
      filters.setState({ clienId: 0 });
    }, [onResetPage, filters]);

    const handleRemoveStartDate = useCallback(() => {    
      onResetPage();
      filters.setState({ startAt: null });
    }, [onResetPage, filters]);

    return (
        <FiltersResult totalResults={totalResults} onReset={filters.onResetState} sx={sx}>
            <FiltersBlock label="Canal:" isShow={filters.state.channel !== ''}>
                <Chip
                    {...chipProps}
                    label={filters.state.channel}
                    onDelete={handleRemoveChannel}
                    sx={{ textTransform: 'capitalize' }}
                />
            </FiltersBlock>
            <FiltersBlock label="Nombre del cliente:" isShow={filters.state.clientNames !== ''}>
                <Chip
                    {...chipProps}
                    label={filters.state.clientNames}
                    onDelete={handleRemoveClientNames}
                    sx={{ textTransform: 'capitalize' }}
                />
            </FiltersBlock>
            <FiltersBlock label="ID del cliente:" isShow={filters.state.clienId !== 0}>
                <Chip
                    {...chipProps}
                    label="ID del cliente:"
                    onDelete={handleRemoveClientId}
                    sx={{ textTransform: 'capitalize' }}
                />
            </FiltersBlock>
            <FiltersBlock label="Fecha de inicio:" isShow={filters.state.startAt !== null}>
                <Chip
                    {...chipProps}
                    label= "Fecha"
                    onDelete={handleRemoveStartDate}
                    sx={{ textTransform: 'capitalize' }}
                />
            </FiltersBlock>
        </FiltersResult>
    )

};
