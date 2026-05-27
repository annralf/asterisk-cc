'use client';
import type { IDatePickerControl } from 'src/types/common';
import type { SelectChangeEvent } from '@mui/material/Select';
import type { UseSetStateReturn } from 'src/hooks/use-set-state';
import { IMonitoringFilters } from './list';

import { useCallback } from 'react';
import {
  Stack,
  Select,
  MenuList,
  MenuItem,
  Checkbox,
  TextField,
  InputLabel,
  IconButton,
  FormControl,
  OutlinedInput,
  InputAdornment,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { formHelperTextClasses } from '@mui/material/FormHelperText';

import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { Monitor } from '@mui/icons-material';
import { R } from '@fullcalendar/core/internal-common';

type Props = {
  dateError: boolean;
  onResetPage: () => void;
  filters: UseSetStateReturn<IMonitoringFilters | any>;
  options: {
    agent: string[];
  };
};

export const MonitorTableToolbar = ({ filters, options, dateError, onResetPage }: Props) => {
  const popover = usePopover();

  const handleFilterAgent = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onResetPage();
      filters.setState({ agent: event.target.value });
    },
    [filters, onResetPage]
  );

  const handleFilterCampaign = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      const newValue =
        typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value;

      onResetPage();
      filters.setState({ campaing: newValue });
    },
    [filters, onResetPage]
  );
  const handleFilterExtension = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      const newValue =
        typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value;

      onResetPage();
      filters.setState({ extension: newValue });
    },
    [filters, onResetPage]
  );
  const handleFilterServiceStatus = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      const newValue =
        typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value;

      onResetPage();
      filters.setState({ serviceStatus: newValue });
    },
    [filters, onResetPage]
  );

  const handleFilterDate = useCallback(
    (newValue: IDatePickerControl | null, type: 'startDate' | 'endDate') => {
      onResetPage();
      filters.setState((prevState: IMonitoringFilters) => ({
        ...prevState,
        createdAt: {
          ...prevState.createdAt,
          [type]: newValue,
        },
      }));
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
        <TextField
          fullWidth
          value={filters.state.agent}
          onChange={handleFilterAgent}
          placeholder="Agente/Operador"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
        <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 180 } }}>
          <InputLabel htmlFor="invoice-filter-service-select-label">Campaña</InputLabel>

          <Select
            multiple
            value={Array.isArray(filters.state.campaing) ? filters.state.campaing : []}
            onChange={handleFilterCampaign}
            input={<OutlinedInput label="Campaña" />}
            renderValue={(selected) => selected.map((value) => value).join(', ')}
            inputProps={{ id: 'invoice-filter-service-select-label' }}
            sx={{ textTransform: 'capitalize' }}
          >
            {/* {options.services.map((option) => (
              <MenuItem key={option} value={option}>
                <Checkbox
                  disableRipple
                  size="small"
                  checked={filters.state.service.includes(option)}
                />
                {option}
              </MenuItem>
            ))} */}
          </Select>
        </FormControl>
        <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 180 } }}>
          <InputLabel htmlFor="invoice-filter-service-select-label">Extensión</InputLabel>

          <Select
            multiple
            value={Array.isArray(filters.state.extension) ? filters.state.extension : []}
            onChange={handleFilterExtension}
            input={<OutlinedInput label="Campaña" />}
            renderValue={(selected) => selected.map((value) => value).join(', ')}
            inputProps={{ id: 'invoice-filter-service-select-label' }}
            sx={{ textTransform: 'capitalize' }}
          >
            {/* {options.services.map((option) => (
              <MenuItem key={option} value={option}>
                <Checkbox
                  disableRipple
                  size="small"
                  checked={filters.state.service.includes(option)}
                />
                {option}
              </MenuItem>
            ))} */}
          </Select>
        </FormControl>
        <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 180 } }}>
          <InputLabel htmlFor="invoice-filter-service-select-label">Estado del Servicio</InputLabel>
          <Select
            multiple
            value={Array.isArray(filters.state.serviceStatus) ? filters.state.serviceStatus : []}
            onChange={handleFilterServiceStatus}
            input={<OutlinedInput label="Campaña" />}
            renderValue={(selected) => selected.map((value) => value).join(', ')}
            inputProps={{ id: 'invoice-filter-service-select-label' }}
            sx={{ textTransform: 'capitalize' }}
          >
            {/* {options.services.map((option) => (
              <MenuItem key={option} value={option}>
                <Checkbox
                  disableRipple
                  size="small"
                  checked={filters.state.service.includes(option)}
                />
                {option}
              </MenuItem>
            ))} */}
          </Select>
        </FormControl>
        <DatePicker
          label="Desde"
          value={filters.state.createdAt?.startDate}
          onChange={() => {
            handleFilterDate(filters.state.createdAt?.startDate, 'startDate');
          }}
          slotProps={{ textField: { fullWidth: true } }}
          sx={{ maxWidth: { md: 180 } }}
        />
        <DatePicker
          label="Hasta"
          value={filters.state.createdAt?.startDate}
          onChange={() => {
            handleFilterDate(filters.state.createdAt?.startDate, 'endDate');
          }}
          slotProps={{ textField: { fullWidth: true } }}
          sx={{ maxWidth: { md: 180 } }}
        />
      </Stack>
    </>
  );
};