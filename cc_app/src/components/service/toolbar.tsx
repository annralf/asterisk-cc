'use client';
import type { IDatePickerControl } from '@/src/types/common';
import type { UseSetStateReturn } from 'src/hooks/use-set-state';
import { useCallback } from 'react';
import { Stack, TextField, IconButton, InputAdornment } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { IServiceFilters } from './list';

// ----------------------------------------------------------------------

type Props = {
  onResetPage: () => void;
  filters: UseSetStateReturn<IServiceFilters>;
};

export const ServiceTableToolbar = ({ filters, onResetPage }: Props) => {
  const popover = usePopover();
  const handleFilterChannel = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onResetPage();
      filters.setState({ channel: event.target.value });
    },
    [filters, onResetPage]
  );
  const handleFilterClientNames = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onResetPage();
      filters.setState({ clientNames: event.target.value });
    },
    [filters, onResetPage]
  );
  const handleFilterClientId = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onResetPage();
      filters.setState({ clienId: Number(event.target.value) });
    },
    [filters, onResetPage]
  );
  const handleFilterStartDate = useCallback(
    (newValue: IDatePickerControl) => {
      onResetPage();
      filters.setState({ startAt: newValue });
    },
    [filters, onResetPage]
  );
  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: 'center', sm: 'flex-start' }}
        direction={{ xs: 'column', md: 'row' }}
        sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}
      >
        <DatePicker
          label="Fecha"
          value={filters.state.startAt}
          onChange={handleFilterStartDate}
          slotProps={{ textField: { fullWidth: true } }}
          sx={{ maxWidth: { md: 180 } }}
        />
        <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
          <TextField
            label="Canal"
            value={filters.state.channel}
            onChange={handleFilterChannel}
            sx={{ maxWidth: 180 }}
          />
          <TextField
            label="Nombre del cliente"
            value={filters.state.clientNames}
            onChange={handleFilterClientNames}
            sx={{ maxWidth: 180 }}
          />
          <TextField
            label="ID del cliente"
            value={filters.state.clienId}
            onChange={handleFilterClientId}
            sx={{ maxWidth: 180 }}
          />
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
      ></CustomPopover>
    </>
  );
};
