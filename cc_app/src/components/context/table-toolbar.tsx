import type { IDatePickerControl } from 'src/types/common';
import { IContextFilters } from './list';
import type { UseSetStateReturn } from 'src/hooks/use-set-state';

import { useCallback } from 'react';

import {Stack, TextField, IconButton, InputAdornment} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

type Props = {
  onResetPage: () => void;
  filters: UseSetStateReturn<IContextFilters>;
};

export const ContextTableToolBar = ({ filters, onResetPage }: Props) => {
    const popover = usePopover();
    
    const handleFilterName = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
        onResetPage();
        filters.setState({ name: event.target.value });
        },
        [filters, onResetPage]
    );
    
    const handleFilterPermission = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
        onResetPage();
        filters.setState({ permission: event.target.value });
        },
        [filters, onResetPage]
    );

    const handleFilterIsActive = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
        onResetPage();
        filters.setState({ is_active: event.target.value });
        },
        [filters, onResetPage]
    );

    const handleFilterMonitors = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            onResetPage();
            filters.setState({ monitors: event.target.value });
            },
            [filters, onResetPage]
    );
    
    return (
        <Stack spacing={2}
            alignItems={{ xs: 'flex-end', md: 'center' }}
            direction={{ xs: 'column', md: 'row' }}
            sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}
        >
        <TextField
            fullWidth
            size="small"
            value={filters.state.name}
            onChange={handleFilterName}
            placeholder="Buscar nombre"
            InputProps={{
            startAdornment: (
                <InputAdornment position="start">
                <Iconify icon="bi:search" />
                </InputAdornment>
            ),
            }}
        />
        <TextField
            fullWidth
            size="small"
            value={filters.state.permission}
            onChange={handleFilterPermission}
            placeholder="Buscar permiso"
            InputProps={{
            startAdornment: (
                <InputAdornment position="start">
                <Iconify icon="bi:search" />
                </InputAdornment>
            ),
            }}
        />
        <TextField
            fullWidth
            size="small"
            value={filters.state.is_active}
            onChange={handleFilterIsActive}
            placeholder="Buscar activo"
            InputProps={{
            startAdornment: (
                <InputAdornment position="start">
                <Iconify icon="bi:search" />
                </InputAdornment>
            ),
            }}
        />
        <TextField
            fullWidth
            size="small"
            value={filters.state.monitors}
            onChange={handleFilterMonitors}
            placeholder="Buscar por monitores"
            InputProps={{
            startAdornment: (
                <InputAdornment position="start">
                <Iconify icon="bi:search" />
                </InputAdornment>
            ),
            }}
        />
        </Stack>
    );
};