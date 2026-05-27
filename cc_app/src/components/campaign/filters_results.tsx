'use client';

import type { Theme, SxProps } from '@mui/material/styles';
import type { UseSetStateReturn } from 'src/hooks/use-set-state';

import { ICampaignFilters } from './list';

import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

type Props = {
  totalResults: number;
  sx?: SxProps<Theme>;
  onResetPage: () => void;
  filters: UseSetStateReturn<ICampaignFilters>;
};

export const CampaignTableFiltersResult = ({ filters, totalResults, onResetPage, sx }: Props) => {
    const handleRemoveStatus = useCallback(() => {
        onResetPage();
        filters.setState({ status: '' });
    }, [filters, onResetPage]);

    const handleRemoveIsActive = useCallback(() => {
        onResetPage();
        filters.setState({ is_active: '' });
    }, [filters, onResetPage]);

    return(
        <FiltersResult totalResults={totalResults} onReset={filters.onResetState} sx={sx}>
        <FiltersBlock label="Status:" isShow={filters.state.status !== 'all'}>
        <Chip
          {...chipProps}
          label={filters.state.status}
          onDelete={handleRemoveStatus}
          sx={{ textTransform: 'capitalize' }}
        />
      </FiltersBlock>
        <FiltersBlock label="Is Active:" isShow={filters.state.is_active !== 'all'}>
        <Chip
          {...chipProps}
          label={filters.state.is_active}
          onDelete={handleRemoveIsActive}
          sx={{ textTransform: 'capitalize' }}
        />
      </FiltersBlock>
    </FiltersResult>
    );
};