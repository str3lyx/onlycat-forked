import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import {
  Container,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@mui/material'

export default function ForgetPasswordPage() {
  return (
    <Box
      display='flex'
      alignItems='center'
      justifyContent='center'
      width='100%'
      height='100vh'
      bgcolor='Background'
    >
      <Container maxWidth='md'>
        <form>
          <Grid container component={Paper} p={5} spacing={2}>
            <Grid size={12}>
              <Typography variant='h3'>Forget password</Typography>
            </Grid>
            <Grid size={12} component={Divider} />

            <Grid size={12}>
              <TextField
                fullWidth
                variant='outlined'
                label='E-mail'
                type='email'
                name='email'
              />
            </Grid>
            
            <Grid size={12}>
              <Button fullWidth type='submit' variant='contained' size='large'>
                Request
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    </Box>
  )
}
