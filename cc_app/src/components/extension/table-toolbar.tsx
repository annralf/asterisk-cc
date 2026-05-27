import type { IDatePickerControl } from 'src/types/common';
import { IExtensionFilters } from './list';
import type { UseSetStateReturn } from 'src/hooks/use-set-state';

import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import {
  Typography,
  Select,
  MenuItem,
  Checkbox,
  SelectChangeEvent,
  OutlinedInput,
  Radio,
} from '@mui/material';

type Props = {
  onResetPage: () => void;
  filters: UseSetStateReturn<IExtensionFilters>;
  options: {
    extensions: string[];
    status: string[];
  };
};

export const ExtensionTableToolBar = ({ filters, onResetPage, options }: Props) => {
  const popover = usePopover();
  const handleFilterExtension = useCallback(
    (event: SelectChangeEvent<string>) => {
      const newValue = event.target.value;
      onResetPage();
      filters.setState({ extension: newValue });
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

  return (
    <Stack
      spacing={2}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      direction={{ xs: 'column', md: 'row' }}
      sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}
    >
      <Stack direction="column" alignItems="flex-start" spacing={1}>
        <Typography variant="body2">Buscar por extensión</Typography>
        <Select
          value={filters.state.extension || ''}
          onChange={handleFilterExtension}
          sx={{ textTransform: 'capitalize', minWidth: 200 }}
        >
          {options.extensions.map((option) => (
            <MenuItem key={option} value={option}>
              <Checkbox disableRipple size="small" checked={filters.state.extension === option} />
              {option}
            </MenuItem>
          ))}
        </Select>
      </Stack>
      <Stack direction="column" alignItems="flex-start" spacing={1}>
        <Typography variant="body2">Buscar por actividad</Typography>
        <Select
          value={filters.state.status || ''}
          onChange={handleFilterStatus}
          input={<OutlinedInput label="Activos" />}
          sx={{ textTransform: 'capitalize', minWidth: 200 }}
        >
          {options.status.map((option) => (
            <MenuItem key={option} value={option}>
              <Radio disableRipple size="medium" checked={filters.state.status.includes(option)} />
              {option === 'true' ? 'Activa' : 'Inactiva'}
            </MenuItem>
          ))}
        </Select>
      </Stack>
    </Stack>
  );
};