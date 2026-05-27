"use client";
import type { IDatePickerControl } from "@/src/types/common";
import type { UseSetStateReturn } from 'src/hooks/use-set-state';
import { useCallback } from 'react';
import {Stack, TextField, IconButton, InputAdornment} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { IClient } from "@/src/types/app";

// ----------------------------------------------------------------------

type Props = {
  onResetPage: () => void;
  filters: UseSetStateReturn<IClient>;
};

export const ClientTableToolbar = ({ filters, onResetPage }: Props) => {
    const popover = usePopover();
    const handleFilterFirst_name = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
          onResetPage();
          filters.setState({ first_name: event.target.value });
        },
        [filters, onResetPage]
      );
   /*  const handleFilterClientLastNames = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
          onResetPage();
          filters.setState({ lastName: event.target.value });
        },
        [filters, onResetPage]
      ); */
    const handleFilterClientId = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
          onResetPage();
          filters.setState({ id: Number(event.target.value) });
        },
        [filters, onResetPage]
      );
      const handleFilterStartDate = useCallback(
        (newValue: Date | null) => {
          onResetPage();
          filters.setState({ created_at: newValue ?? undefined });
        },
        [filters, onResetPage]
      );
    return(
        <>
            <Stack spacing={2} alignItems={{ xs: 'center', sm: 'flex-start' }} direction={{ xs: 'column', md: 'row' }} sx={{p: 2.5, pr: {xs: 2.5, md: 1}}}>
               {/*  <DatePicker label="Fecha" value={filters.state.createdAt} onChange={handleFilterStartDate} slotProps={{textField:{fullWidth: true}}} sx={{maxWidth:{md:180}}}/> */}
                <Stack direction='row' alignItems='center' spacing={2} flexGrow={1} sx={{width:1}}>
                    <TextField label="Nombre del Cliente" value={filters.state.first_name || ''} onChange={handleFilterFirst_name} sx={{maxWidth:180}}/>
                   {/*  <TextField label="Apellido del cliente" value={filters.state.lastName} onChange={handleFilterClientLastNames} sx={{maxWidth:180}}/> */}
                    <TextField label="ID del cliente" value={filters.state.id ?? 0} onChange={handleFilterClientId} sx={{maxWidth:180}}/>
                    <IconButton onClick={popover.onOpen}>
                    <Iconify icon="eva:more-vertical-fill" />
                </IconButton>
                </Stack>
            </Stack>
            <CustomPopover
            open={popover.open}
            anchorEl={popover.anchorEl}
            onClose={popover.onClose}
            slotProps={{ arrow: { placement: 'right-top' } }}
        >       
        </CustomPopover>
        </>
    )
}