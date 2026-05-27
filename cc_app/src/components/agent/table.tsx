'use client';

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

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { IServicesAgent } from '@/src/types/app';

// -------------------------User table-------------------------------------

type Props = {
  row: IServicesAgent;
  selected: boolean;
  onViewRow: () => void;
  onEditRow: () => void;
  onSelectRow: () => void;
};

export const AgentTable = ({
  row,
  selected,
  onViewRow,
  onEditRow,
  onSelectRow,
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
          <Stack spacing={2} direction="row" alignItems="center">
            <ListItemText
              disableTypography
              primary={
                <Typography variant="body2" noWrap>
                  {row.extensionsAgent?.agent1?.user1?.first_name}{' '}
                  {row.extensionsAgent?.agent1?.user1?.last_name}
                </Typography>
              }
            />
          </Stack>
        </TableCell>
        <TableCell>
          <ListItemText
            primary={row.service1?.name}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          />
        </TableCell>
        <TableCell>
          <ListItemText
            primary={row.extensionsAgent?.extension1?.identity}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          />
        </TableCell>
        <TableCell>
          <ListItemText
            primary={row.extensionsAgent?.isActive}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          />
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
