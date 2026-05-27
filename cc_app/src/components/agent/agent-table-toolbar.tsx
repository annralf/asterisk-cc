'use client';
import type { IDatePickerControl } from 'src/types/common';
import type { SelectChangeEvent } from '@mui/material/Select';
import type { UseSetStateReturn } from 'src/hooks/use-set-state';

import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { formHelperTextClasses } from '@mui/material/FormHelperText';

import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { IAgentFilters } from './list';
import { Radio } from '@mui/material';

type Props = {
  onResetPage: () => void;
  filters: UseSetStateReturn<IAgentFilters>;
  options: {
    status: string[];
    services: string[];
    extensions: string[];
  };
};

export const AgentTableToolbar = ({ filters, onResetPage, options }: Props) => {
  const popover = usePopover();

  const handleFilterStatus = useCallback(
    (event: SelectChangeEvent<string>) => {
        const newValue = event.target.value;
        onResetPage();
        filters.setState({ status: newValue });
      },
      [filters, onResetPage]
  );
  const handleFilterService = useCallback(
    (event: SelectChangeEvent<string>) => {
      const newValue = event.target.value;
      onResetPage();
      filters.setState({ service: newValue });
    },
    [filters, onResetPage]
  );

  const handleFilterExtension = useCallback(
    (event: SelectChangeEvent<string>) => {
        const newValue = event.target.value;
        onResetPage();
        filters.setState({ service: newValue });
      },
      [filters, onResetPage]
  );

  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{ xs: 'column', md: 'row' }}
        sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}
      >
        <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 180 } }}>
          <InputLabel htmlFor="invoice-filter-status-select-label">Estado</InputLabel>

          <Select
            value={filters.state.status}
            onChange={handleFilterStatus}
            input={<OutlinedInput label="Estado" />}
            inputProps={{ id: 'invoice-filter-status-select-label' }}
            sx={{ textTransform: 'capitalize' }}
          >
            {options.status.map((option) => (
              <MenuItem key={option} value={option}>
                <Radio
                  disableRipple
                  size="small"
                  checked={filters.state.status.includes(option)}
                />
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 180 } }}>
          <InputLabel htmlFor="invoice-filter-service-select-label">Service</InputLabel>

          <Select
            value={filters.state.service}
            onChange={handleFilterService}
            input={<OutlinedInput label="Service" />}
            inputProps={{ id: 'invoice-filter-service-select-label' }}
            sx={{ textTransform: 'capitalize' }}
          >
            {options.services.map((option) => (
              <MenuItem key={option} value={option}>
                <Radio
                  disableRipple
                  size="small"
                  checked={filters.state.service.includes(option)}
                />
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 180 } }}>
          <InputLabel htmlFor="invoice-filter-extension-select-label">Extensión</InputLabel>

          <Select
            value={filters.state.extension}
            onChange={handleFilterExtension}
            input={<OutlinedInput label="Extensión" />}
            inputProps={{ id: 'invoice-filter-extension-select-label' }}
            sx={{ textTransform: 'capitalize' }}
          >
            {options.extensions.map((option) => (
              <MenuItem key={option} value={option}>
                <Radio
                  disableRipple
                  size="small"
                  checked={filters.state.extension.includes(option)}
                />
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </>
  );
};
