'use client';

import { useEffect, useState, useCallback, use } from 'react';

import { ComponentBlock } from '@/src/sections/_examples/component-block';
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Box,
  Paper,
  CircularProgress,
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Stack,
} from '@mui/material';

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { green, red } from "@mui/material/colors";

import { Iconify } from '../iconify';

import { getDialPlan, getServerStatus, getServerConnection } from '@/src/services/core';

import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { Scrollbar } from 'src/components/scrollbar';
import { TableHeadCustom } from 'src/components/table';
import index from 'swr';

interface Extension {
  extension: string;
  action: string;
}

interface Include {
  context: string;
}

interface DialplanContext {
  created_by?: string;
  extensions?: Extension[];
  includes?: Include[];
}

interface FormattedData {
  context: string;
  createdBy: string;
  extensions: string;
  includes: string;
}

const TABLE_HEAD = [
  { id: 'context', label: 'Contexto Configurado' },
  { id: 'createdBy', label: 'Creado Por' },
  { id: 'extensions', label: 'Extensiones' },
  { id: 'includes', label: 'Incluye' },
];

const DialPlanStatus = () => {
  const [extensions, setExtensions] = useState<
    { context: string; createdBy: string; extensions: string; includes: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [controlled, setControlled] = useState<string | false>(false);
  const [serverStatus, setServerStatus] = useState<any>({});
  const [outputRows, setOutputRows] = useState<any[]>([]);
  const [backgroundColor, setBackgroundColor] = useState<string>('');
  const [isSystemOnline, setIsSystemOnline] = useState<boolean>(false);
  const [pingStatus, setPingStatus] = useState<any>({});

  //============================== Start Dial plan status fetch ==============================================

  const fetchDialPlan = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await getDialPlan();
      const formattedData: FormattedData[] = Object.entries(
        result.dialplan.data as Record<string, DialplanContext>
      ).map(([context, details]) => ({
        context,
        createdBy: details.created_by || 'N/A',
        extensions:
          details.extensions?.map((ext) => `${ext.extension}: ${ext.action}`).join(', ') || 'N/A',
        includes: details.includes?.map((inc) => inc.context).join(', ') || 'N/A',
      }));
      setExtensions(formattedData);
    } catch (error) {
      console.error('Error fetching dial plan', error);
      setError('No se pudo cargar la información debido a una pérdida de conexión con Optimus Server. Verifique su conexión e intente nuevamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  //============================== End Dial plan status fetch ================================================

  //============================== Start server status fetching ==================================================

  const fetchServerStatus = useCallback(async () => {
    try {
      const result = await getServerStatus();
      console.log('Server status:', result);
      setServerStatus(result.status);
    } catch (error) {
      console.error('Error fetching server status', error);
    }
  }, []);

  useEffect(() => {
    if (serverStatus?.Response) {
      setBackgroundColor(
        serverStatus.Response === 'Success' ? 'primary.lighter' : 'secondary.lighter'
      );
  
      // Verifica si serverStatus.Output es un string antes de llamar a split()
      setOutputRows(
        typeof serverStatus.Output === 'string'
          ? serverStatus.Output.split('\n').map((line: any) => {
              const [key, ...value] = line.split(':');
              return { key: key.trim(), value: value.join(':').trim() };
            })
          : []
      );
    }
  }, [serverStatus]);

  //============================== End server status fetching ====================================================


  //============================== Start server connection ====================================================
  const fetchServerConnection = useCallback(async () => {
    try {
      const result = await getServerConnection();
      setPingStatus(result);

      // Se actualiza isSystemOnline solo cuando los datos estén disponibles
      if (result?.ping?.Response) {
        setIsSystemOnline(result.ping.Response === "Success");
      }
    } catch (error) {
      console.error('Error fetching server connection', error);
    }
  }, []);

  //============================== End server connection ======================================================

  
  useEffect(() => {
    fetchDialPlan();
    fetchServerConnection();
    fetchServerStatus();
  }, [fetchDialPlan, fetchServerConnection, fetchServerStatus]);


  useEffect(() => {}, [extensions]);
  useEffect(() => {}, [isSystemOnline]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={200}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={200}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (extensions.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={200}>
        <Typography>No hay datos disponibles.</Typography>
      </Box>
    );
  }

  //============================== Start Dialplan Table ================================================
  const handleChangeControlled =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setControlled(isExpanded ? panel : false);
    };
  const dialplanTable = () => {
    return (
      <Table sx={{ minWidth: 800 }}>
        <TableHeadCustom headLabel={TABLE_HEAD} />
        <TableBody>
          {extensions.map((row) => (
            <TableRow key={row.context}>
              <TableCell>{row.context}</TableCell>
              <TableCell>{row.createdBy}</TableCell>
              <TableCell>{row.extensions}</TableCell>
              <TableCell>{row.includes}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };
  //============================== End Dialplan Table ==================================================

  //============================== Start server status Table ==================================================
  const serverStatusTable = () => {
    return (
        <Stack spacing={3} direction="column" sx={{ width: "100%" }}>
        <Paper sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <Typography variant="h6">Estado del Sistema</Typography>
          {isSystemOnline ? (
            <CheckCircleOutlineIcon sx={{ color: green[500] }} /> // ✅ Icono verde si está en línea
          ) : (
            <HighlightOffIcon sx={{ color: red[500] }} /> // ❌ Icono rojo si está caído
          )}
        </Stack>
          <Table>
            <TableBody>
              {outputRows.map((row: any, index: any) => (
                <TableRow key={index}>
                  <TableCell sx={{ fontWeight: 'bold' }}>{row.key}</TableCell>
                  <TableCell>{row.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Stack>
    );
  };
  //============================== End server status Table ====================================================

  return (
    <Scrollbar>
      <ComponentBlock>
       {
        serverStatusTable()
       }
        <div>
          <Accordion
            expanded={controlled === 'dialplan'}
            onChange={handleChangeControlled('dialplan')}
          >
            <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
              <Typography variant="subtitle1" sx={{ width: '33%', flexShrink: 0, ml: 3 }}>
                Configuración del Dial Plan
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}></Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Paper sx={{ p: 3 }}>{dialplanTable()}</Paper>
            </AccordionDetails>
          </Accordion>
        </div>
      </ComponentBlock>
    </Scrollbar>
  );
};

export { DialPlanStatus };
