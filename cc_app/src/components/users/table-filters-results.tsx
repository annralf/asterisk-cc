import type { Theme, SxProps } from '@mui/material/styles';
import type { UseSetStateReturn } from 'src/hooks/use-set-state';

import { IUserFilters } from './list';

import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

// ----------------------------------------------------------------------

type Props = {
  totalResults: number;
  sx?: SxProps<Theme>;
  onResetPage: () => void;
  filters: UseSetStateReturn<IUserFilters>;
};

export function UserTableFiltersResult({ filters, totalResults, onResetPage, sx }: Props) {
  const handleRemoveNames = useCallback(() => {
    onResetPage();
    filters.setState({ first_name: '' });
  }, [filters, onResetPage]);

  
  const handleRemoveCreatedAt = useCallback(() => {
    onResetPage();
    filters.setState({ createdAt: null });
  }, [filters, onResetPage]);

  const handleRemoveEmail = useCallback(() => {
    onResetPage();
    filters.setState({ email: '' });
  }, [filters, onResetPage]);

  return (
    <FiltersResult totalResults={totalResults} onReset={filters.onResetState} sx={sx}>    

      <FiltersBlock label="Nombres:" isShow={filters.state.first_name !== ''}>
        <Chip
          {...chipProps}
          label={filters.state.first_name}
          onDelete={handleRemoveNames}
          sx={{ textTransform: 'capitalize' }}
        />
      </FiltersBlock>
      <FiltersBlock label="Fecha de inicio:" isShow={filters.state.first_name !== null}>
        <Chip
          {...chipProps}
          label={filters.state.first_name}
          onDelete={handleRemoveCreatedAt}
          sx={{ textTransform: 'capitalize' }}
        />
      </FiltersBlock>

      <FiltersBlock
        label="Correo electrónico:"
        isShow={Boolean(filters.state.email)}
      >
        <Chip
          {...chipProps}
          label={filters.state.email}
          onDelete={handleRemoveEmail}
        />
      </FiltersBlock>

      <FiltersBlock label="Keyword:" isShow={!!filters.state.first_name}>
        <Chip {...chipProps} label={filters.state.first_name} onDelete={handleRemoveNames} />
      </FiltersBlock>
    </FiltersResult>
  );
}