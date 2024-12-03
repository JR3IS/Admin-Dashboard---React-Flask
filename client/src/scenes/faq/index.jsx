import React from "react";
import { Box, useTheme, Typography } from "@mui/material";
import Header from "../../components/Header";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { ExpandMore } from "@mui/icons-material";
import { tokens } from "../../theme";

export default function FAQ() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m='20px'>
      <Header title='FAQ' subtitle='Frequently Asked Questions' />

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography sx={{ color: colors.greenAccent[500] }} variant='h5'>
            How do I get started?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            To get started, create an account and follow the onboarding
            tutorial.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography sx={{ color: colors.greenAccent[500] }} variant='h5'>
            What features are included?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Our platform includes dashboard analytics, user management, and
            reporting tools.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography sx={{ color: colors.greenAccent[500] }} variant='h5'>
            Is there customer support?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Yes, we offer 24/7 customer support via email, chat, and phone.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography sx={{ color: colors.greenAccent[500] }} variant='h5'>
            What is the pricing structure?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            We offer tiered pricing plans: Basic, Pro, and Enterprise, with
            monthly and annual billing options.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography sx={{ color: colors.greenAccent[500] }} variant='h5'>
            Can I integrate with other tools?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            We provide API access and integrations with popular productivity and
            CRM tools.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography sx={{ color: colors.greenAccent[500] }} variant='h5'>
            What security measures are in place?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            We use end-to-end encryption, two-factor authentication, and regular
            security audits.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
