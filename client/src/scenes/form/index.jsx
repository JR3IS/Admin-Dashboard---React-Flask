import {
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useMediaQuery } from "@mui/material";
import Header from "../../components/Header";
import axios from "axios"; // Axios for API requests

export default function Form() {
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    role: "",
    accessLevel: "",
  };

  const phoneRegExp = /^(\+|00)?(?:[0-9]\s?){6,14}[0-9]$/;

  const userSchema = yup.object().shape({
    firstName: yup.string().required("required"),
    lastName: yup.string().required("required"),
    email: yup.string().email("E-mail is not valid").required("required"),
    contact: yup
      .string()
      .matches(phoneRegExp, "Phone number is not valid")
      .required("required"),
    role: yup.string().required("required"),
    accessLevel: yup.string().required("required"),
  });

  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users",
        values
      ); // Replace with your API endpoint
      console.log("User Created:", response.data);
      alert("User successfully created!");
      resetForm(); // Clear form after successful submission
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Failed to create user. Please try again.");
    }
  };

  return (
    <Box m='20px'>
      <Header
        title='Create User Profile'
        subtitle='Add a new member to the Team'
      />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={userSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display='grid'
              gap='30px'
              gridTemplateColumns='repeat(4, minmax(0,1fr))'
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                mt: "70px",
              }}
            >
              <TextField
                fullWidth
                variant='filled'
                type='text'
                label='First Name'
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.firstName}
                name='firstName'
                error={!!touched.firstName && !!errors.firstName}
                helperText={touched.firstName && errors.firstName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant='filled'
                type='text'
                label='Last Name'
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.lastName}
                name='lastName'
                error={!!touched.lastName && !!errors.lastName}
                helperText={touched.lastName && errors.lastName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant='filled'
                type='text'
                label='E-mail'
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name='email'
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant='filled'
                type='text'
                label='Contact Number'
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.contact}
                name='contact'
                error={!!touched.contact && !!errors.contact}
                helperText={touched.contact && errors.contact}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant='filled'
                type='text'
                label='Role'
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.role}
                name='role'
                error={!!touched.role && !!errors.role}
                helperText={touched.role && errors.role}
                sx={{ gridColumn: "span 4" }}
              />
              <FormControl
                fullWidth
                variant='filled'
                sx={{ gridColumn: "span 4" }}
              >
                <InputLabel id='access-level-label'>Access Level</InputLabel>
                <Select
                  labelId='access-level-label'
                  value={values.accessLevel}
                  onChange={handleChange}
                  name='accessLevel'
                  onBlur={handleBlur}
                  error={!!touched.accessLevel && !!errors.accessLevel}
                >
                  <MenuItem value='Admin'>Admin</MenuItem>
                  <MenuItem value='Manager'>Manager</MenuItem>
                  <MenuItem value='User'>User</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box display='flex' justifyContent='end' mt='20px'>
              <Button type='submit' color='secondary' variant='contained'>
                Create New User
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
}
