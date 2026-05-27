'use client';

import type { Theme, SxProps } from '@mui/material/styles';
import type { UseSetStateReturn } from 'src/hooks/use-set-state';

import { IAgentFilters } from './list';

import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

type Props = {
  totalResults: number;
  sx?: SxProps<Theme>;
  onResetPage: () => void;
  filters: UseSetStateReturn<IAgentFilters>;
};

export const AgentTableFiltersResult = ({ filters, totalResults, onResetPage, sx }: Props) => {
    const handleRemoveStatus = useCallback(() => {
        onResetPage();
        filters.setState({ status: '' });
    }, [filters, onResetPage]);

    const handleRemoveService = useCallback(() => {
        onResetPage();
        filters.setState({ service: '' });
    }, [filters, onResetPage]);

    const handleRemoveExtension = useCallback(() => {
        onResetPage();
        filters.setState({ extension: '' });
    }, [filters, onResetPage]);

    return(
        <FiltersResult totalResults={totalResults} onReset={filters.onResetState} sx={sx}>
        <FiltersBlock label="Estado:" isShow={filters.state.status !== 'all'}>
        <Chip
          {...chipProps}
          label={filters.state.status}
          onDelete={handleRemoveStatus}
          sx={{ textTransform: 'capitalize' }}
        />
      </FiltersBlock>
        <FiltersBlock label="Servicio:" isShow={filters.state.status !== 'all'}>
        <Chip
          {...chipProps}
          label={filters.state.status}
          onDelete={handleRemoveService}
          sx={{ textTransform: 'capitalize' }}
        />
      </FiltersBlock>
        <FiltersBlock label="Extension:" isShow={filters.state.status !== 'all'}>
        <Chip
          {...chipProps}
          label={filters.state.status}
          onDelete={handleRemoveExtension}
          sx={{ textTransform: 'capitalize' }}
        />
      </FiltersBlock>
    </FiltersResult>
    )
}