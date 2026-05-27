'use client';

import { IService } from "src/types/app";
import { useState, useCallback } from "react";

import { Box, Card, Table, Stack, Divider, TableRow, TableHead, TableBody, Typography, TableCell, TableCellClasses, styled, tableCellClasses, Button, NoSsr, Dialog, Tooltip, MenuItem, TextField, IconButton, DialogActions, CircularProgress, Accordion, AccordionDetails, AccordionSummary } from "@mui/material";

import { fDate } from "src/utils/format-time";

import { Label } from "src/components/label";

import ModalContextForm from "./modal";
import { AgentTable } from "./agents-table";
import { Iconify } from "../iconify";
import { Scrollbar } from "../scrollbar";
import ModalCampaign from "./modal";
import { accordion } from "@/src/theme/core/components/accordion";

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

type props = {
    service?: IService;
};

type toolbarProps = {
    service?: IService;
    onEdit: () => void; 
};

const CampaignViewToolbar = ({ service, onEdit }: toolbarProps) => {
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
            <ModalCampaign open={open} onClose={handleClose} service={service ?? null} />
        </>
    );
};

// --------------------------------View Definition--------------------------------------

const CampaignDetail = ({ service }: props) => {
    const [currentStatus, setCurrentStatus] = useState(service?.is_active);

    const campaignList = (
        <Scrollbar sx={{mt:5}}>
            <Accordion>
                <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
                  <Typography variant="subtitle1">Agentes</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <AgentTable />
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
                  <Typography variant="subtitle1">Agentes</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <AgentTable />
                </AccordionDetails>
            </Accordion>
        </Scrollbar>
    );
    return(
            <>
                <CampaignViewToolbar service={service} onEdit={() =>{}}/>
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
                                <Typography variant="body2">{service?.created_at ? fDate(service.created_at) : ''}</Typography>
                            </Stack>
                            <Stack sx={{ typography: 'body2', textAlign: 'left' }}>
                                <Typography variant="subtitle2">Fecha de última actualización</Typography>
                                <Typography variant="body2">{service?.updated_at ? fDate(service.updated_at) : ''}</Typography>
                            </Stack>
                        </Stack>
                    </Box>
                    {campaignList}
                </Card>
            </>
        );
}


export default CampaignDetail;