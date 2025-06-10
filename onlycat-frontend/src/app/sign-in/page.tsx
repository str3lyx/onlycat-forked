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

export default function SignInPage() {
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
              <Typography variant='h3'>Sign in</Typography>
            </Grid>
            <Grid size={12} component={Divider} />

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

              <Grid
                size={'grow'}
                component={Box}
                sx={{
                  display:'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start'
                }}
              >
                <Link href='/forget-password'>Forgot password?</Link>
              </Grid>
              <Grid size={9}>
                <Button fullWidth type='submit' variant='contained' size='large'>
                  Sign in
                </Button>
              </Grid>

              <Grid size={12} component={Divider} children='or' />
              <Grid size={12}>
                <Stack direction='row' alignItems='center' justifyContent='center'>
                  <Typography component='span'>No account?</Typography>
                  <Link ml={1} href='/register'>Register</Link>
                </Stack>
              </Grid>
          </Grid>
        </form>
      </Container>
    </Box>
  )
}