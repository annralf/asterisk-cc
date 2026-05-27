'use client';

import React from 'react';
import {
  Stack,
  TableRow,
  Checkbox,
  TableCell,
  IconButton,
  Typography,
  ListItemText,
  MenuList,
  MenuItem,
} from '@mui/material';

import { useBoolean } from '@/src/hooks/use-boolean';
import { usePopover, CustomPopover } from '@/src/components/custom-popover';
import { Iconify } from '@/src/components/iconify';
import { calculateElapsedTime, fDate } from '@/src/utils/format-time';

export interface IServiceList {
 id: number;
  channel: string;
  service: string;
  status: string;
  startAt: string;
  endAt: string;
  clientNames: string;
  clienId: number;
}

type Props = {
  row: IServiceList;
  selected: boolean;
  onViewRow: () => void;
  onEditRow: () => void;
  onSelectRow: () => void;
};

export const ServiceTable = ({ row, selected, onViewRow, onEditRow, onSelectRow }: Props) => {
  const popover = usePopover();
  const confirm = useBoolean();

  return (
    <>
      <TableRow hover selected={selected}>
        {/* Checkbox */}
        <TableCell padding="checkbox">
          <Checkbox
            checked={selected}
            onClick={onSelectRow}
            inputProps={{
              id: `row-checkbox-${row.clienId}`,
              'aria-label': `Seleccionar fila ${row.clienId}`,
            }}
          />
        </TableCell>

        {/* Canal */}
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <ListItemText
              primary={<Typography variant="subtitle2">{row.channel}</Typography>}
            />
          </Stack>
        </TableCell>

        {/* Cliente */}
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <ListItemText
              primary={<Typography variant="subtitle2">{row.clientNames}</Typography>}
              secondary={<Typography variant="body2" color="text.secondary">{`ID: ${row.clienId}`}</Typography>}
            />
          </Stack>
        </TableCell>

        {/* Servicio */}
        <TableCell>
          <Typography variant="subtitle2">{row.service}</Typography>
        </TableCell>

        {/* Estado */}
        <TableCell>
          <Typography variant="subtitle2">{row.status}</Typography>
        </TableCell>

        {/* Tiempo transcurrido */}
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <ListItemText
              primary={
                <Typography variant="subtitle2">
                  {calculateElapsedTime(row.startAt, row.endAt)}
                </Typography>
              }
              secondary={
                <Typography variant="body2" color="text.secondary">
                  {fDate(row.startAt)}
                </Typography>
              }
            />
          </Stack>
        </TableCell>

        {/* Acciones */}
        <TableCell align="right" sx={{ px: 1 }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      {/* Popover para acciones */}
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
            <Typography variant="body2" sx={{ ml: 1 }}>
              Ver detalle
            </Typography>
          </MenuItem>

          <MenuItem
            onClick={() => {
              onEditRow();
              popover.onClose();
            }}
          >
            <Iconify icon="line-md:edit" />
            <Typography variant="body2" sx={{ ml: 1 }}>
              Editar
            </Typography>
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </>
  );
};