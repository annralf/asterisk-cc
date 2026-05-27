'use client';

import { IContextDef } from "src/types/app";
import { useState, useCallback } from "react";

import { Box, Card, Table, Stack, Divider, TableRow, TableHead, TableBody, Typography, TableCell, TableCellClasses, styled, tableCellClasses, Button, NoSsr, Dialog, Tooltip, MenuItem, TextField, IconButton, DialogActions, CircularProgress } from "@mui/material";

import { fDate } from "src/utils/format-time";

import { Label } from "src/components/label";

import ModalContextForm from "./modal";
import { Iconify } from "../iconify";
import { Scrollbar } from "../scrollbar";

// ----------------------------------------------------------------------

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    [`& .${tableCellClasses.root}`]: {
      textAlign: 'right',
      borderBottom: 'none',
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
  }));
  
// ----------------------------------------------------------------------

type Props = {
  context?: IContextDef;
};

type ToolbarProps = {
    context?: IContextDef;
    onEdit: () => void;
};

const ContextViewToolbar = ({ context, onEdit }: ToolbarProps) => {
    const [open, setOpen] = useState<boolean>(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Stack  spacing={3}
                direction={{ xs: 'column', sm: 'row' }}
                alignItems={{ xs: 'flex-end', sm: 'center' }}
                sx={{ mb: { xs: 3, md: 5 } }}>
                <Stack direction="row" spacing={1} flexGrow={1} sx={{ width: 1 }}>
                <Tooltip title="Edit">
                    <IconButton onClick={handleClickOpen}>
                        <Typography variant="subtitle2">Editar</Typography>
                    <Iconify icon="solar:pen-bold" />
                    </IconButton>
                </Tooltip>
                </Stack>
            </Stack>
            <ModalContextForm open={open} onClose={handleClose} context={context} />
        </>
    );
};

// --------------------------------View Definition--------------------------------------

const ContextDetail = ({ context }: Props) => {
    const [currentStatus, setCurrentStatus] = useState(context?.is_active);

    const extensionsList = (
        <Scrollbar sx={{ mt: 5 }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Extensión</TableCell>
                        <TableCell>Estado</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {context?.extensions?.map((extension, index) => (
                        <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{extension.identity}</TableCell>
                            <TableCell>{extension.status}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Scrollbar>
    );
    return(
        <>
            <ContextViewToolbar context={context} onEdit={() => {}} />
            <Card sx={{ pt: 5, px: 5 }}>
                <Box 
                 rowGap={5}
                 display="flex"
                 alignItems="flex-end"
                 textAlign={{ xs: 'left', md: 'left' }}
               
                >
                    <Stack spacing={1} alignItems="flex-start">
                        <Stack direction="column" spacing={1}>
                            <Label
                                variant="soft"
                                color={
                                    (currentStatus === true && 'success') ||
                                    (currentStatus === false && 'error') ||
                                    'default'
                                }
                            >
                                {currentStatus ? 'Activo' : 'Inactivo'}
                            </Label>
                        </Stack>
                        <Stack sx={{ typography: 'body2', textAlign: 'left' }}>
                            <Typography variant="subtitle2">Fecha de creación</Typography>
                            <Typography variant="body2">{context?.created_at ? fDate(context.created_at) : ''}</Typography>
                        </Stack>
                        <Stack sx={{ typography: 'body2', textAlign: 'left' }}>
                            <Typography variant="subtitle2">Fecha de última actualización</Typography>
                            <Typography variant="body2">{context?.created_at ? fDate(context.updated_at) : ''}</Typography>
                        </Stack>
                    </Stack>
                </Box>
                {extensionsList}
            </Card>
        </>
    );
};

export default ContextDetail;