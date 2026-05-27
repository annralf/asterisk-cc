import React from 'react'
import AddIcon from '@mui/icons-material/Add';
import PauseIcon from '@mui/icons-material/Pause';
import MicOffIcon from '@mui/icons-material/MicOff';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Stack, Button, Box } from '@mui/material'

const AgentPanel = () => {
    return (
        <Stack display='flex' direction="row" alignItems='center'  spacing={1} sx={{ mb: 2, height: 100 }}>
            <Box>
                <Button variant="contained" color="primary" startIcon={<PlayArrowIcon />}>
                    Play
                </Button>
            </Box>
            <Box>
                <Button variant="contained" color="secondary" startIcon={<MicOffIcon />}>
                    Silence
                </Button>
            </Box>
            <Box>
                <Button variant="contained" startIcon={<PauseIcon />}>
                    Pause Listening
                </Button>
            </Box>

            <Box>
                <Button variant="contained" color="success" startIcon={<AddIcon />}>
                    Add Observation
                </Button>
            </Box>

        </Stack>
    )
}

export default AgentPanel