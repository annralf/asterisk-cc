'use client';

import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { useBoolean } from 'src/hooks/use-boolean';
import { fDate } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { IServicesCategory } from '@/src/types/app';
import { ICategory } from '@/src/services/serviceCategory';
import Switch from '@mui/material/Switch';

// -------------------------User table-------------------------------------

type Props = {
  row: ICategory;
  selected: boolean;
  onViewRow: () => void;
  onEditRow: () => void;
  onSelectRow: () => void;
  onDisableRow: () => void;
};

export const ServiceCategoryTable = ({
  row,
  selected,
  onViewRow,
  onEditRow,
  onSelectRow,
  onDisableRow,
}: Props) => {
  const confirm = useBoolean();
  const popover = usePopover();
  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox
            checked={selected}
            onClick={onSelectRow}
            inputProps={{ id: `row-checkbox-${row.id}`, 'aria-label': `Row checkbox` }}
          />
        </TableCell>
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2">{row.service.name}</Typography>
          </Stack>
        </TableCell>
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2">{row.name}</Typography>
          </Stack>
        </TableCell>
        <TableCell>
          <Switch
            checked={row.is_active === true}
            color={row.is_active ? 'success' : 'secondary'}
          />
          <Typography variant="subtitle2">{row.is_active ? 'Activo' : 'Inactivo'}</Typography>
        </TableCell>
        <TableCell align="right" sx={{ px: 1 }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>
      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              onViewRow();
              popover.onClose();
            }}
          >
            <Iconify icon="solar:eye-bold" />
            Ver detalle
          </MenuItem>

          <MenuItem
            onClick={() => {
              onEditRow();
              popover.onClose();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Editar
          </MenuItem>
          <Divider sx={{ borderStyle: 'dashed' }} />
          <MenuItem
            onClick={() => {
              onDisableRow();
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="qlementine-icons:page-setup-16" />
            Inhabilitar
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </>
  );
};
