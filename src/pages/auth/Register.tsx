import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useNavigate } from "react-router-dom";
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import CircularProgress from '@mui/material/CircularProgress';
import { Link } from 'react-router-dom';
import { tokens } from "../../theme/theme";
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useState, useEffect } from 'react';
import {  useTheme,} from "@mui/material";
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import AppTheme from './../../theme/AppTheme';
import AuthService from "./../../services/auth/auth.service";
import SelectableCity from '../../components/fields/SelectableCity';
import UserTypeSelect from '../../components/fields/UserTypeSelect';
import OutletSelect from '../../components/fields/OutletSelect';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './style.css';
import OutletService from "./../../services/outlet.service";

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100%)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

export default function Register(props: { disableCustomTheme?: boolean }) {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState('');
  const [nicError, setNicError] = React.useState(false);
  const [nicErrorMessage, setNicErrorMessage] = React.useState('');
  const [phoneNumberError, setPhoneNumberError] = React.useState(false);
  const [phoneNumberErrorMessage, setPhoneNumberErrorMessage] = React.useState('');
  const [addressError, setAddressError] = React.useState(false);
  const [addressErrorMessage, setAddressErrorMessage] = React.useState('');
  const [businessRegistrationError, setBusinessRegistrationError] = React.useState(false);
  const [businessRegistrationErrorMessage, setBusinessRegistrationErrorMessage] = React.useState('');
  const [noOfCylindersAllowedError, setNoOfCylindersAllowedError] = React.useState(false);
  const [noOfCylindersAllowedErrorMessage, setNoOfCylindersAllowedErrorMessage] = React.useState('');
  const [selectedCity, setSelectedCity] = React.useState('');
  const [selectedUserType, setSelectedUserType] = React.useState('');
  const [selectedOutlet, setselectedOutlet] = React.useState('');
  const [errors, setErrors] = React.useState({});
  const [outlets, setOutlets] = React.useState({});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    const theme = useTheme();
      const colors = tokens(theme.palette.mode);

  const handleCityChange = (selectedCity) => {
    setSelectedCity(selectedCity.value);
  };

  const handleUserTypeChange = (selectedUserType) => {
    setSelectedUserType(selectedUserType);
  };

  const handleOutletChange = (selectedOutlet) => {
    setselectedOutlet(selectedOutlet.value);
  };


  const validateInputs = () => {
    const email = document.getElementById('email') as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;
    const name = document.getElementById('name') as HTMLInputElement;
    const nic = document.getElementById('nic') as HTMLInputElement;
    const phoneNumber = document.getElementById('phoneNumber') as HTMLInputElement;
    const address = document.getElementById('address') as HTMLInputElement;

    let isValid = true;

    if (!selectedCity) {
      setAddressError(true);
      setAddressErrorMessage('Please enter the address.');
      isValid = false;
    } else {
      setAddressError(false);
      setAddressErrorMessage('');
    }

    if (!email.value) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a email address.');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (selectedUserType.value != 0) {
      const businessRegistration = document.getElementById('businessRegistration') as HTMLInputElement;
      const noOfCylindersAllowed = document.getElementById('noOfCylindersAllowed') as HTMLInputElement;

      if (!businessRegistration.value) {
        setBusinessRegistrationError(true);
        setBusinessRegistrationErrorMessage('Please enter the Business Registration number.');
        isValid = false;
      } else if (!noOfCylindersAllowed.value) {
        setNoOfCylindersAllowedError(true);
        setNoOfCylindersAllowedErrorMessage('Please enter the number of cylinder you want per month.');
        isValid = false;
        setBusinessRegistrationError(false);
        setBusinessRegistrationErrorMessage('');
      }
      else {
        setNoOfCylindersAllowedError(false);
        setNoOfCylindersAllowedErrorMessage('');
        setBusinessRegistrationError(false);
        setBusinessRegistrationErrorMessage('');
      }
    }

    if (!address.value) {
      setAddressError(true);
      setAddressErrorMessage('Please enter the address.');
      isValid = false;
    } else {
      setAddressError(false);
      setAddressErrorMessage('');
    }

    if (!phoneNumber.value) {
      setPhoneNumberError(true);
      setPhoneNumberErrorMessage('Please enter a phone number.');
      isValid = false;
    } else {
      setPhoneNumberError(false);
      setPhoneNumberErrorMessage('');
    }


    if (!nic.value || password.value.length < 6) {
      setNicError(true);
      setNicErrorMessage('Please enter a valid NIC number.');
      isValid = false;
    } else {
      setNicError(false);
      setNicErrorMessage('');
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    if (!name.value || name.value.length < 1) {
      setNameError(true);
      setNameErrorMessage('Fullname is required.');
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage('');
    }

    return isValid;
  };

  useEffect(() => {
    const fetchOutlets = async () => {
      setLoading(true);
      setError(null); // Reset error state
      try {
        const outLetData = await OutletService.getAllOutlet();
        console.log(outLetData)
        setOutlets(outLetData);
        setLoading(false);

      } catch (err) {
        setError(err);
        setLoading(false);
        console.log(err)
      }
    };

    fetchOutlets();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    if (nameError || emailError || passwordError || nicError || phoneNumberError || addressError) {
      event.preventDefault();
      return;
    }
    const data = new FormData(event.currentTarget);
    event.preventDefault();
    try {
      const outletId = selectedOutlet;
      const loginResponse = await AuthService.register(outletId,data.get('email'), data.get('password'), data.get('fullname'), data.get('nic'), data.get('phoneNumber'), data.get('address'), data.get('city'), "Manager");
      if (loginResponse && loginResponse.token) {
        setErrors([]);
        toast.success('Registration successful! please login');
        setInterval(() => {
          navigate("/login", { replace: true });
        }, 3000);
      }
      else {
        toast.error('Something missing');
      }
    } catch (error) {
      console.log(error)
      if (error.status == 400 && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else if (error.status == 400 && error.response.data) {
        setErrors(error.response.data.errors);
      }
      else if (error.status == 401 && error.response.data) {
        toast.error(error.response.data);
      } else if (error.status == 500 && error.response.data) {
        setErrors(error.response.data.errors);
      }
      else if (error.status == 500 && error.response.data) {
        setErrors(error.response.data.errors);
      }
      else {
        toast.error('Something missing');
      }
    }
  };

  if (loading) {
    return <Box
    sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // Full viewport height
    }}
>
    <CircularProgress color="primary" sx={{ color: colors.blueAccent[700] }} />      </Box>;
  }

  if (error) {
    return <p>Error fetching outlets: {error.message}</p>;
  }

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <ToastContainer />
      <SignUpContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Sign up
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <FormControl>
              <FormLabel htmlFor="name">Full name</FormLabel>
              <TextField
                autoComplete="name"
                name="fullname"
                required
                fullWidth
                id="name"
                placeholder="Jon Snow"
                error={nameError}
                helperText={nameErrorMessage}
                color={nameError ? 'error' : 'primary'}
              />
              {errors.FullName && errors.FullName.map((error) => (
                <p class="server-error-message">
                  {error} </p>
              ))}
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="nic">National ID</FormLabel>
              <TextField
                autoComplete="nic"
                name="nic"
                required
                fullWidth
                id="nic"
                placeholder="9932654556V"
                error={nicError}
                helperText={nicErrorMessage}
                color={nicError ? 'error' : 'primary'}
              /> {errors.NIC && errors.NIC.map((error) => (
                <p class="server-error-message">
                  {error} </p>
              ))}
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="address">Address</FormLabel>
              <TextField
                autoComplete="address"
                name="address"
                required
                fullWidth
                id="address"
                placeholder="No.107, Colombo"
                error={addressError}
                helperText={addressErrorMessage}
                color={addressError ? 'error' : 'primary'}
              />{errors.Address && errors.Address.map((error) => (
                <p class="server-error-message">
                  {error} </p>
              ))}
            </FormControl>

            <SelectableCity name="city" onCitySelect={handleCityChange} />
            {errors.City && errors.City.map((error) => (
              <p class="server-error-message">
                {error} </p>
            ))}
            
            <FormControl>
              <FormLabel htmlFor="phoneNumber">Phone Number</FormLabel>
              <TextField
                autoComplete="phoneNumber"
                name="phoneNumber"
                type="number"
                required
                fullWidth
                id="phoneNumber"
                placeholder="0770058954"
                error={phoneNumberError}
                helperText={phoneNumberErrorMessage}
                color={phoneNumberError ? 'error' : 'primary'}
              />
            </FormControl>
            {errors.PhoneNumber && errors.PhoneNumber.map((error) => (
              <p class="server-error-message">
                {error} </p>
            ))}

            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                required
                fullWidth
                id="email"
                placeholder="your@email.com"
                name="email"
                autoComplete="email"
                variant="outlined"
                error={emailError}
                helperText={emailErrorMessage}
                color={passwordError ? 'error' : 'primary'}
              /> {errors.Email && errors.Email.map((error) => (
                <p class="server-error-message">
                  {error} </p>
              ))}
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                required
                fullWidth
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="new-password"
                variant="outlined"
                error={passwordError}
                helperText={passwordErrorMessage}
                color={passwordError ? 'error' : 'primary'}
              />{errors.Password && errors.Password.map((error) => (
                <p class="server-error-message">
                  {error} </p>
              ))}
            </FormControl>

            <OutletSelect name="outletId" onOutletSelect={handleOutletChange} outlets={outlets} />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}
            >
              Sign up
            </Button>
            <Link to="/login">I want to Sign In?</Link>
          </Box>
        </Card>
      </SignUpContainer>
    </AppTheme>
  );
}
