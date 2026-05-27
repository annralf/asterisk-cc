'use client';
import { ISupport } from "@/src/types/app";
import { IMonitoringList } from "./list";

import { Link, Stack, Button, Divider, MenuList, MenuItem, TableRow, Checkbox, TableCell, IconButton, Typography, ListItemText } from "@mui/material";

import { useBoolean } from "@/src/hooks/use-boolean";
import { fDate, fTime } from "@/src/utils/format-time";
import { Iconify } from "@/src/components/iconify";
import { usePopover, CustomPopover } from 'src/components/custom-popover';

type Props = {
  row: IMonitoringList;
  selected: boolean;
  onViewRow: () => void;
  onEditRow: () => void;
  onSelectRow: () => void;
};

export const MonitorTableRow = ({ row, selected, onViewRow, onEditRow, onSelectRow }: Props) => {
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
                <Typography variant="subtitle2" noWrap>
                {row.agent}
                </Typography>
            </Stack>
            </TableCell>
    
            <TableCell>
            <Typography variant="subtitle2" noWrap>
                {row.extension}
            </Typography>
            </TableCell>
    
            <TableCell>
            <Typography variant="subtitle2" noWrap>
                {row.campaing}
            </Typography>
            </TableCell>
    
            <TableCell>
            <Typography variant="subtitle2" noWrap>
                {row.createdAt}
            </Typography>
            </TableCell>

            <TableCell>
            <Typography variant="subtitle2" noWrap>
                {fDate(row.serviceStatus)}
            </Typography>
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
            <Iconify icon="mingcute:horn-2-line" />
            Escuchar en vivo
          </MenuItem>

          <MenuItem
            onClick={() => {
              onEditRow();
              popover.onClose();
            }}
          >
            <Iconify icon="solar:play-line-duotone" />
            Reproducir grabación
          </MenuItem>

          <Divider sx={{ borderStyle: 'dashed' }} />

          <MenuItem
            onClick={() => {
              confirm.onTrue();
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="fluent:apps-list-detail-20-regular" />
            Ver detalle
          </MenuItem>
        </MenuList>
      </CustomPopover>
        </>
    );
};