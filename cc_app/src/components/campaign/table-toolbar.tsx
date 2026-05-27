'use client';

import type { IDatePickerControl } from 'src/types/common';
import type { UseSetStateReturn } from 'src/hooks/use-set-state';

import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { ICampaignFilters } from './list';

import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import {
  Checkbox,
  MenuItem,
  OutlinedInput,
  Radio,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { options } from '@fullcalendar/core/preact';

type Props = {
  onResetPage: () => void;
  filters: UseSetStateReturn<ICampaignFilters>;
  options: {
    status: string[];
    is_active: string[];
  };
};

export const CampaignTableToolBar = ({ filters, onResetPage, options }: Props) => {
  const popover = usePopover();

  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onResetPage();
      filters.setState({ name: event.target.value });
    },
    [filters, onResetPage]
  );

  const handleFilterStatus = useCallback(
    (event: SelectChangeEvent<string>) => {
      const newValue = event.target.value;
      onResetPage();
      filters.setState({ status: newValue });
    },
    [filters, onResetPage]
  );

  const handleFilterIsActive = useCallback(
    (event: SelectChangeEvent<string>) => {
      const newValue = event.target.value;
      onResetPage();
      filters.setState({ is_active: newValue });
    },
    [filters, onResetPage]
  );
  return (
    <Stack
      spacing={2}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      direction={{ xs: 'column', md: 'row' }}
      sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}
    >
      <Stack direction="column" alignItems="flex-start" spacing={1} sx={{ minWidth: 200 }}>
        <Typography variant="body2">Buscar por campaña</Typography>
        <TextField
          fullWidth
          size="medium"
          label=""
          value={filters.state.name}
          onChange={handleFilterName}
        />
      </Stack>
      <Stack direction="column" alignItems="flex-start" spacing={1}>
        <Typography variant="body2">Buscar por estado de la campaña</Typography>
        <Select
          value={filters.state.status}
          onChange={handleFilterStatus}
          sx={{ textTransform: 'capitalize', minWidth: 200 }}
        >
          {options.status.map((option) => (
            <MenuItem key={option} value={option}>
              <Checkbox
                disableRipple
                size="small"
                checked={filters.state.status.includes(option)}
              />
              {option === 'true' ? 'Activa' : 'Inactiva'}
            </MenuItem>
          ))}
        </Select>
      </Stack>
      <Stack direction="column" alignItems="flex-start" spacing={1}>
        <Typography variant="body2">Buscar por actividad</Typography>
        <Select
          value={filters.state.is_active}
          onChange={handleFilterIsActive}
          input={<OutlinedInput label="Activos" />}
          sx={{ textTransform: 'capitalize', minWidth: 200 }}
        >
          {options.is_active.map((option) => (
            <MenuItem key={option} value={option}>
              <Radio
                disableRipple
                size="medium"
                checked={filters.state.is_active.includes(option)}
              />
              {option}
            </MenuItem>
          ))}
        </Select>
      </Stack>
    </Stack>
  );
};