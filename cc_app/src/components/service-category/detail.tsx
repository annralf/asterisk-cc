'use client';   

import { IServicesCategory } from "@/src/types/app";

import { useState } from "react";

import { Box, Card, Table, Stack, Divider, TableRow, TableHead, TableBody, Typography, TableCell, TableCellClasses, styled, tableCellClasses, Button, NoSsr, Dialog, Tooltip, MenuItem, TextField, IconButton, DialogActions, CircularProgress } from "@mui/material";

import { fDate } from "src/utils/format-time";
import { Label } from "src/components/label";

import { Iconify } from "../iconify";
import { Scrollbar } from "../scrollbar";

import ModalServiceCategoryForm from "./modal";

// ----------------------------------------------------------------------

type Props = {
    category?: IServicesCategory;
};

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    [`& .${tableCellClasses.root}`]: {
        textAlign: 'right',
        borderBottom: 'none',
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    },
}));

const ServiceCategoryDetail = ({ category } : Props) => {
    const [currentStatus, setCurrentStatus] = useState(category?.is_active);
    const [open, setOpen] = useState<boolean>(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const categoriesList = (
        <Scrollbar sx={{ mt: 3, maxHeight: 240 }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Estado</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    { category?.supports_details &&
                    category?.supports_details.map((item:any) => (
                        <StyledTableRow key={item.id}>
                            <TableCell>{item.support1?.services?.name}</TableCell>
                            <TableCell>{item.support1?.status }</TableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </Scrollbar>
    );
    return(
        <>
            <Card>
                <Stack spacing={3} sx={{ p: 3 }}>
                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="h6">Detalle de la categoría</Typography>
                        <Stack direction="row" spacing={1}>
                            <Tooltip title="Editar">
                                <IconButton onClick={handleClickOpen}>
                                    <Iconify icon="mdi:pencil" />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    </Stack>
                    <Divider />
                    <Stack spacing={2}>
                        <Stack direction="row" spacing={2}>
                            <Typography variant="subtitle2">Nombre:</Typography>
                            <Typography variant="subtitle2">{category?.name}</Typography>
                        </Stack>
                        <Stack direction="row" spacing={2}>
                            <Typography variant="subtitle2">Estado:</Typography>
                            <Typography variant="subtitle2">{category?.is_active}</Typography>
                        </Stack>
                        <Stack direction="row" spacing={2}>
                            <Typography variant="subtitle2">Creado:</Typography>
                            <Typography variant="subtitle2">{fDate(category?.created_at)}</Typography>
                        </Stack>
                        <Stack direction="row" spacing={2}>
                            <Typography variant="subtitle2">Actualizado:</Typography>
                            <Typography variant="subtitle2">{fDate(category?.updated_at)}</Typography>
                        </Stack>
                    </Stack>
                    <Divider />
                    <Stack spacing={2}>
                        <Typography variant="h6">Servicios de la categoría</Typography>
                        {categoriesList}
                    </Stack>
                </Stack>
            </Card>
            <ModalServiceCategoryForm open={open} onClose={handleClose} serviceCategory={category} />
        </>
    );
};

export default ServiceCategoryDetail;