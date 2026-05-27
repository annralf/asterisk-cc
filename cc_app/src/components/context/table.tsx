'use client';
import {
  Stack,
  TableRow,
  Checkbox,
  TableCell,
  IconButton,
  Typography,
  Chip,
  Switch,
  Divider,
  MenuItem,
  MenuList,
} from '@mui/material';

import { useBoolean } from '@/src/hooks/use-boolean';
import { Iconify } from '@/src/components/iconify';
import { usePopover, CustomPopover } from '../custom-popover';

import { IContextDef } from '@/src/types/app';

type Props = {
  row: IContextDef;
  selected: boolean;
  onViewRow: () => void;
  onEditRow: () => void;
  onSelectRow: () => void;
  onDisable: () => void;
};

export const ContextTable = ({
  row,
  selected,
  onViewRow,
  onEditRow,
  onSelectRow,
  onDisable,
}: Props) => {
  const confirm = useBoolean();

  const popover = usePopover();

  const handleDelete = () => {
    console.log('Delete chip');
  };

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
            <Typography variant="subtitle2">{row.name}</Typography>
          </Stack>
        </TableCell>

        <TableCell>
          <Typography variant="subtitle2">{row.permission}</Typography>
        </TableCell>

        <TableCell>
          <Stack direction="row" spacing={1}>
            {row.monitors?.split(',').map((monitor, index) => {
              return <Chip key={index} label={monitor} variant="soft" onDelete={handleDelete} />;
            })}
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
            <Iconify icon="bi:eye" />
            Ver detalle
          </MenuItem>

          <MenuItem
            onClick={() => {
              onEditRow();
              popover.onClose();
            }}
          >
            <Iconify icon="bi:pencil" />
            Editar
          </MenuItem>
          <MenuItem
            onClick={() => {
              onDisable();
              popover.onClose();
            }}
          >
            <Iconify icon="bi:trash" />
            Inhabilitar
          </MenuItem>
          {/* <Divider sx={{ borderStyle: 'dashed' }} /> */}
        </MenuList>
      </CustomPopover>
    </>
  );
};