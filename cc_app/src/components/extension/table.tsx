'use client';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { ExtensionItem } from '@/src/services/extension';
import { Switch } from '@mui/material';

type Props = {
  row: ExtensionItem;
  selected: boolean;
  onViewRow: () => void;
  onEditRow: () => void;
  onSelectRow: () => void;
  onDisable: () => void;
};

export const ExtensionTable = ({
  row,
  selected,
  onViewRow,
  onEditRow,
  onSelectRow,
  onDisable,
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
            <Typography variant="subtitle2">{row.identity}</Typography>
          </Stack>
        </TableCell>
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2">
              {typeof row.service === 'object' && row.service?.service ? row.service.service : "Sin Asignar"}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2">{row.agent?.names ? row.agent?.names : "Por Asignar"}</Typography>
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
