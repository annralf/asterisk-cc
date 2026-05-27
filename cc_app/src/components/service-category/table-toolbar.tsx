'use client';
import type { SelectChangeEvent } from '@mui/material/Select';
import type { UseSetStateReturn } from 'src/hooks/use-set-state';

import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import OutlinedInput from '@mui/material/OutlinedInput';
import { usePopover } from 'src/components/custom-popover';
import { Radio, Typography } from '@mui/material';
import { IServiceCategoryFilters } from './list';

type Props = {
  onResetPage: () => void;
  filters: UseSetStateReturn<IServiceCategoryFilters>;
  options: {
    services: string[];
    status: string[];
  };
};

export const ServiceCategoryTableToolbar = ({ filters, onResetPage, options }: Props) => {
  const popover = usePopover();
  const handleFilterService = useCallback(
    (event: SelectChangeEvent<string>) => {
      const newValue = event.target.value;
      onResetPage();
      filters.setState({ service: newValue });
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
  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onResetPage();
      filters.setState({ name: event.target.value });
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
        <Typography variant="body2">Buscar por categoría</Typography>
        <TextField
          fullWidth
          size="medium"
          label=""
          value={filters.state.name}
          onChange={handleFilterName}
        />
      </Stack>
      <Stack direction="column" alignItems="flex-start" spacing={1}>
        <Typography variant="body2">Buscar por campaña</Typography>
        <Select
          value={filters.state.service || ''}
          onChange={handleFilterService}
          sx={{ textTransform: 'capitalize', minWidth: 200 }}
        >
          {options.services.map((option) => (
            <MenuItem key={option} value={option}>
              <Checkbox disableRipple size="small" checked={filters.state.service === option} />
              {option}
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
          {options.status.map((option) => (
            <MenuItem key={option} value={option}>
              <Radio
                disableRipple
                size="medium"
                checked={filters.state.is_active.includes(option)}
              />
              {option === 'true' ? 'Activa' : 'Inactiva'}
            </MenuItem>
          ))}
        </Select>
      </Stack>
    </Stack>
  );
};
