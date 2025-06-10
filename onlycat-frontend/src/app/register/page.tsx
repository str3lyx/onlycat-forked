import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import {
  Container,
  Divider,
  Grid,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

export default function RegisterPage() {
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
              <Typography variant='h3'>Register</Typography>
            </Grid>
            <Grid size={12}>
              <Divider />
            </Grid>
            <Grid size={6}>
              <TextField
                fullWidth
                variant='outlined'
                label='Firstname'
                name='firstname'
              />
            </Grid>
            <Grid size={6}>
              <TextField
                fullWidth
                variant='outlined'
                label='Lastname'
                name='lastname'
              />
            </Grid>
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
              <TextField
                fullWidth
                variant='outlined'
                label='Username'
                name='username'
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                variant='outlined'
                label='Password'
                type='password'
                name='password'
              />
            </Grid>
            <Grid size={12}>
              <Button fullWidth type='submit' variant='contained' size='large'>
                Register
              </Button>
            </Grid>

            <Grid size={12} component={Divider} children='or' />
            <Grid size={12}>
              <Stack direction='row' alignItems='center' justifyContent='center'>
                <Typography component='span'>Already has account?</Typography>
                <Link ml={1} href='/sign-in'>Sign in</Link>
              </Stack>
            </Grid>
          </Grid>
        </form>
      </Container>
    </Box>
  )
}
