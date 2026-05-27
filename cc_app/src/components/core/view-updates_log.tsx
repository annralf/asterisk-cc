'use client';

import { useEffect, useState, useCallback, use } from 'react';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Chip from '@mui/material/Chip';

import { Scrollbar } from 'src/components/scrollbar';
import { TableHeadCustom } from 'src/components/table';
import { Box, Stack, Button, Paper, CircularProgress, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { getCoreUpdatesLog, updateCoreUpdateLog } from '@/src/services/coreUpdatesLog';

import { restartServerConnection, setupExtensions, setupPjsip, setupQueue } from '@/src/services/core';

interface IUser {
  first_name: string;
  id: number;
  last_name: string;
}

interface ICoreUpdateLog {
  action: string;
  reference: string;
  created_at: string | null;
  id: number;
  status: string;
  updated_at: string | null;
  users: IUser[];
}

interface IPagination {
  [key: string]: any;
}

interface IResponse {
  core_updates_log: ICoreUpdateLog[];
  pagination: IPagination;
  total: number;
}

const TABLE_HEAD = [
  { id: 'reference', label: 'Reference' },
  { id: 'action', label: 'Action' },
  { id: 'status', label: 'Status', align: 'right' },
  { id: 'created_at', label: 'Created At', align: 'right' },
  { id: 'updated_at', label: 'Updated At', align: 'right' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'done':
      return 'success';
    case 'pending':
      return 'warning';
    default:
      return 'default';
  }
};

interface IForm {
  step_next?: () => void | null;
  step_back?: () => void | null;
}

const CoreUpdatesTable: React.FC<IForm> = ({ step_next = null, step_back = null }) => {
  const router = useRouter();
  const [hasPendingStatus, setHasPendingStatus] = useState<boolean>(false);
  const [hasExtension, setHasExtension] = useState<boolean>(false);
  const [hasService, setHasService] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<ICoreUpdateLog[]>([]);

  // ========================== Cargar datos al montar ====================================
  const fetchCoreUpdatesLog = useCallback(async () => {
    try {
      const response = await getCoreUpdatesLog();
      setData(response.core_updates_log);
    } catch (error) {
      console.error('Error fetching core updates log', error);
    }
  }, [data]);

  // ========================== Verificar si hay estado 'pending' ==========================

  //============================Start handling final setup =================================
  // Función para recargar Asterisk
  const reloadAsterisk = () => {
    console.log('Recargando Asterisk...');
    const services = data.filter((row) => row.reference === 'Service' || row.reference === 'Context');
    const extensions = data.filter((row) => row.reference === 'Extension');
    if(hasService){
      setupQueue().then((e) => {
        console.log('Queue setup:', e);
        setupPjsip().then((e) => {
          console.log('Pjsip setup:', e);
          services.forEach((service) => {
            updateCoreUpdateLog(service.id, { status: 'done' }).then((e) => {
              console.log('Service updated:', e);
            }).catch((error) => {
              console.error('Error updating Service:', error);
            });
          })
        }
        ).catch((error) => {  
          console.error('Error setting up Pjsip:', error);
        }
        );
      }).catch((error) => {
        console.error('Error setting up Queue:', error);
      });
    }
    if(hasExtension){
      setupExtensions().then((e) => {
        console.log('Extensions setup:', e);
        extensions.forEach((extension) => {
          updateCoreUpdateLog(extension.id, { status: 'done' }).then((e) => {
            console.log('Extension updated:', e);
          }).catch((error) => {
            console.error('Error updating Extension:', error);
          });
        });
      }).catch((error) => {
        console.error('Error setting up Extensions:', error);
      });
    }
    //Restarting ASTERISK
    restartServerConnection().then((e) => {
      console.log('Server restarted:', e);
      fetchCoreUpdatesLog();
      setIsLoading(false);
    }).catch((error) => {
      console.error('Error restarting server:', error);
    });
  };
  const handleRestore = () => {
    if(hasPendingStatus){
      setIsLoading(true);
      reloadAsterisk();
    }else{
      if (step_next) {
        step_next();
      }
    }
    //router.push(paths.init.test);
  };
  //============================End handling final setup =========================================================

  //============================ Format date string =========================================================
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };
  //============================ Format date string =========================================================

  useEffect(() => {
    const hasPending = data.some((row) => row.status === 'pending');
    setHasPendingStatus(hasPending);
  }, [hasPendingStatus, data]);

  useEffect(() => {
    const hasExt = data.some((row) => row.reference === 'Extension');
    setHasExtension(hasExt);
  }, [data, hasExtension]);

  useEffect(() => {
    const hasService = data.some((row) => row.reference === 'Service' || row.reference === 'Context');
    setHasService(hasService);
  }, [data, hasService]);

  useEffect(() => {
    if (data.length === 0) {
      fetchCoreUpdatesLog();
    }
  }, []);

  useEffect(() => {}, [isLoading]);
  return (
    <>
      <Paper
        sx={{
          p: 3,
          my: 3,
          minHeight: 120,
        }}
      >
        <Stack direction={'column'} spacing={2}>
          <Box display="flex" justifyContent="center">
            <Scrollbar>
              {
                isLoading ? (
                  <Stack direction="column" spacing={2} mt={5}>
                    <CircularProgress
                      color="info"
                      sx={{
                        display: isLoading ? 'block' : 'none',
                        margin: '0 auto',
                      }}
                    />
                    <Typography variant="h5" align="center" color="info">
                      Cargando...
                    </Typography>
                  </Stack>
                ): (
                  <Table sx={{ minWidth: 800 }}>
                <TableHeadCustom headLabel={TABLE_HEAD} />
                <TableBody>
                  {
                  data.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.reference}</TableCell>
                      <TableCell>{row.action}</TableCell>
                      <TableCell align="right">
                        <Chip
                          variant="outlined"
                          label={row.status === 'pending' ? 'Pendiente por Instalar' : 'Instalado'}
                          color={getStatusColor(row.status)}
                        />
                      </TableCell>
                      <TableCell align="right">
                        {row.created_at ? formatDate(row.created_at) : '-'}
                      </TableCell>
                      <TableCell align="right">
                        {row.updated_at ? formatDate(row.updated_at) : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
                )
              }              
            </Scrollbar>
          </Box>
        </Stack>
        {step_back ? (
          <Stack direction="row" spacing={2} mt={5}>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              sx={{ marginTop: 2 }}
              onClick={() => step_back()}
            >
              Anterior
            </Button>
            <Button
              onClick={handleRestore}
              variant="contained"
              fullWidth
              disabled={isLoading}
              sx={{ marginTop: 2, backgroundColor: hasPendingStatus ? '#f44336' : '#0a2a39' }}
            >
              {hasPendingStatus ? 'Recargar Optimus Server y Finalizar Configuración' : 'Finalizar'}
            </Button>
          </Stack>
        ):(
          <Stack direction="row" spacing={2} mt={5}>
          <Button
            onClick={handleRestore}
            variant="contained"
            fullWidth
            disabled={isLoading}
            sx={{ marginTop: 2, backgroundColor: hasPendingStatus ? '#f44336' : '#0a2a39' }}
          >
            {hasPendingStatus ? 'Recargar Optimus Server y Finalizar Configuración' : 'Finalizar'}
          </Button>
        </Stack>
        )}
      </Paper>
    </>
  );
};

export default CoreUpdatesTable;