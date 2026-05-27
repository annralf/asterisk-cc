import type { IDatePickerControl } from 'src/types/common';
import { IUserFilters } from './list';
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

// ----------------------------------------------------------------------

type Props = {
  onResetPage: () => void;
  filters: UseSetStateReturn<IUserFilters>;
};

export function UserTableToolbar({ filters, onResetPage }: Props) {
  const popover = usePopover();

  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onResetPage();
      filters.setState({ first_name: event.target.value });
    },
    [filters, onResetPage]
  );

 /*  const handleFilterService = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      const newValue =
        typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value;

      onResetPage();
      filters.setState({ service: newValue });
    },
    [filters, onResetPage]
  );
 */
  const handleFilterStartDate = useCallback(
    (newValue: IDatePickerControl) => {
      onResetPage();
      filters.setState({ createdAt: newValue });
    },
    [filters, onResetPage]
  );

  /* const handleFilterEndDate = useCallback(
    (newValue: IDatePickerControl) => {
      onResetPage();
      filters.setState({ endDate: newValue });
    },
    [filters, onResetPage]
  );
 */
  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{ xs: 'column', md: 'row' }}
        sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}
      >      

        <DatePicker
          label="Fecha de creación"
          value={filters.state.createdAt}
          onChange={handleFilterStartDate}
          slotProps={{ textField: { fullWidth: true } }}
          sx={{ maxWidth: { md: 180 } }}
        />
        <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
          <TextField
            fullWidth
            value={filters.state.first_name}
            onChange={handleFilterName}
            placeholder="Buscar por usuario"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
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
      >       
      </CustomPopover>
    </>
  );
}
