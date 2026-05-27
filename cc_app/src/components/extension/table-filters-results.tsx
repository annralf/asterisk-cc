'use client';
import type { Theme, SxProps } from '@mui/material/styles';
import type { UseSetStateReturn } from 'src/hooks/use-set-state';

import { IExtensionFilters } from './list';

import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

type Props = {
  totalResults: number;
  sx?: SxProps<Theme>;
  onResetPage: () => void;
  filters: UseSetStateReturn<IExtensionFilters>;
};

export function ExtensionTableFiltersResult({ filters, totalResults, onResetPage, sx }: Props) {
  const handleRemoveExtension = useCallback(() => {
    onResetPage();
    filters.setState({ extension: '' });
  }, [filters, onResetPage]);

  const handleRemoveStatus = useCallback(() => {
    onResetPage();
    filters.setState({ status: '' });
  }, [filters, onResetPage]);

  return (
    <FiltersResult totalResults={totalResults} onReset={filters.onResetState} sx={sx}>
      <FiltersBlock label="Extensión:" isShow={filters.state.extension !== ''}>
        <Chip
          {...chipProps}
          label={filters.state.extension}
          onDelete={handleRemoveExtension}
          sx={{ textTransform: 'capitalize' }}
        />
      </FiltersBlock>
      <FiltersBlock label="Estado:" isShow={filters.state.status !== ''}>
        <Chip
          {...chipProps}
          label={filters.state.status}
          onDelete={handleRemoveStatus}
          sx={{ textTransform: 'capitalize' }}
        />
      </FiltersBlock>
    </FiltersResult>
  );
}