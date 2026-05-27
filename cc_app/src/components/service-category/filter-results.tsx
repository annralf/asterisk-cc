'use client';

import type { Theme, SxProps } from '@mui/material/styles';
import type { UseSetStateReturn } from 'src/hooks/use-set-state';

import { IServiceCategoryFilters } from './list';

import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

type Props = {
  totalResults: number;
  sx?: SxProps<Theme>;
  onResetPage: () => void;
  filters: UseSetStateReturn<IServiceCategoryFilters>;
};

export const ServiceCategoryTableFiltersResult = ({ filters, totalResults, onResetPage, sx }: Props) => {
    const handleRemoveName = useCallback(() => {
        onResetPage();
        filters.setState({ name: '' });
    }, [filters, onResetPage]);

    const handleRemoveService = useCallback(() => {
        onResetPage();
        filters.setState({ service: '' });
    }, [filters, onResetPage]);

    const handleRemoveIsActive = useCallback(() => {
        onResetPage();
        filters.setState({ is_active: '' });
    }, [filters, onResetPage]);

    return(
        <FiltersResult totalResults={totalResults} onReset={filters.onResetState} sx={sx}>
        <FiltersBlock label="Categoría:" isShow={filters.state.name !== ''}>
        <Chip
          {...chipProps}
          label={filters.state.name}
          onDelete={handleRemoveName}
          sx={{ textTransform: 'capitalize' }}
        />
      </FiltersBlock>
        <FiltersBlock label="Servicio:" isShow={filters.state.service !== ''}>
        <Chip
          {...chipProps}
          label={filters.state.service}
          onDelete={handleRemoveService}
          sx={{ textTransform: 'capitalize' }}
        />
      </FiltersBlock>
        <FiltersBlock label="Estado:" isShow={filters.state.is_active !== ''}>
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