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
import { IClient } from '../../types/app';


type Props = {
  row: IClient;
  selected: boolean;
  onViewRow: () => void;
  onEditRow: () => void;
  onSelectRow: () => void;
};

export const ClientTable = ({ row, selected, onViewRow, onEditRow, onSelectRow }: Props) => {
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
              id: `row-checkbox-${row.id}`,
              'aria-label': `Seleccionar fila ${row.id}`,
            }}
          />
        </TableCell>
        <TableCell>
          <Typography variant="subtitle2" color="text.secondary">{`${row.id}`}</Typography>
        </TableCell>
        {/* Nombre completo del cliente */}
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <ListItemText
              primary={<Typography variant="subtitle2">{`${row.first_name} ${row.last_name}`}</Typography>}
            /*   secondary={<Typography variant="body2" color="text.secondary">{`ID: ${row.id}`}</Typography>} */
            />
          </Stack>
        </TableCell>

        {/* Tipo de identificación */}
        <TableCell>
          <Typography variant="subtitle2">{row.id_type}</Typography>
        </TableCell>

        {/* Número de identificación */}
        <TableCell>
          <Typography variant="subtitle2">{row.id_number}</Typography>
        </TableCell>

        {/* Correo electrónico */}
        <TableCell>
          <Typography variant="subtitle2">{row.mail}</Typography>
        </TableCell>

        {/* Dirección */}
        <TableCell>
          <Typography variant="subtitle2">{row.address}</Typography>
        </TableCell>

        {/* Teléfono */}
        <TableCell>
          <Typography variant="subtitle2">{row.phone_number}</Typography>
        </TableCell>

        {/* Fecha de creación */}
        <TableCell>
          <Typography variant="subtitle2">{fDate(row.created_at)}</Typography>
        </TableCell>

        {/* Fecha de actualización */}

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