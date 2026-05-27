'use client';
import type { Theme, SxProps } from '@mui/material/styles';
import type { UseSetStateReturn } from 'src/hooks/use-set-state';

import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';
import { IClient } from '@/src/types/app';

// ----------------------------------------------------------------------

type Props = {
  totalResults: number;
  sx?: SxProps<Theme>;
  onResetPage: () => void;
  filters: UseSetStateReturn<IClient>;
};

export const ClientTableFiltersResult = ({ filters, totalResults, onResetPage, sx }: Props) => {
    const handleRemoveChannel = useCallback(() => {
      onResetPage();
      filters.setState({ first_name: '' });
    }, [onResetPage, filters]);

   /*  const handleRemoveClientNames = useCallback(() => {
      onResetPage();
      filters.setState({ lastName: '' });
    }, [onResetPage, filters]);
 */
    const handleRemoveClientId = useCallback(() => {
      onResetPage();
      filters.setState({ id: 0 });
    }, [onResetPage, filters]);

    /* const handleRemoveStartDate = useCallback(() => {    
      onResetPage();
      filters.setState({ startAt: null });
    }, [onResetPage, filters]); */

    return (
        <FiltersResult totalResults={totalResults} onReset={filters.onResetState} sx={sx}>
            <FiltersBlock label="Nombre:" isShow={filters.state.first_name !== ''}>
                <Chip
                    {...chipProps}
                    label={filters.state.first_name}
                    onDelete={handleRemoveChannel}
                    sx={{ textTransform: 'capitalize' }}
                />
            </FiltersBlock>
          {/*   <FiltersBlock label="Nombre del cliente:" isShow={filters.state.lastName !== ''}>
                <Chip
                    {...chipProps}
                    label={filters.state.lastName}
                    onDelete={handleRemoveClientNames}
                    sx={{ textTransform: 'capitalize' }}
                />
            </FiltersBlock> */}
            <FiltersBlock label="ID del cliente:" isShow={filters.state.id !== 0}>
                <Chip
                    {...chipProps}
                    label="ID del cliente:"
                    onDelete={handleRemoveClientId}
                    sx={{ textTransform: 'capitalize' }}
                />
            </FiltersBlock>
           {/*  <FiltersBlock label="Fecha de inicio:" isShow={filters.state.startAt !== null}>
                <Chip
                    {...chipProps}
                    label= "Fecha"
                    onDelete={handleRemoveStartDate}
                    sx={{ textTransform: 'capitalize' }}
                />
            </FiltersBlock> */}
        </FiltersResult>
    )

};
