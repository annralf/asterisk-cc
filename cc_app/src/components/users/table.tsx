import Link from '@mui/material/Link';
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
import { userAccessType } from '@/src/utils/user';

//import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { IUser } from '@/src/types/app';

// -------------------------User table-------------------------------------

type Props = {
  row: IUser;
  selected: boolean;
  onViewRow: () => void;
  onEditRow: () => void;
  onSelectRow: () => void;
  onDeleteRow: () => void;
};

export const UserTable = ({
  row,
  selected,
  onViewRow,
  onEditRow,
  onSelectRow,
  onDeleteRow,
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
            <Typography variant="subtitle2">
              {row.first_name} {row.last_name}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2">
              {userAccessType.find((type) => type.value === row.access_type)?.label}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2">
              {row.created_at ? fDate(row.created_at) : 'N/A'}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2">{row.email}</Typography>
          </Stack>
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

          <MenuItem
            onClick={() => {
              confirm.onTrue();
              popover.onClose();
            }}
          >
            <Iconify icon="qlementine-icons:page-setup-16" />
            Configurar
          </MenuItem>
          <Divider sx={{ borderStyle: 'dashed' }} />
          <MenuItem
            onClick={() => {
              confirm.onTrue();
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