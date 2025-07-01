"use client"
import React, { useState, useEffect, JSX } from 'react';
import {
  Container,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  CircularProgress,
  Alert,
  useTheme,
  alpha,
  Paper,
  Button,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  HelpOutline as HelpIcon,
  QuestionAnswer as QuestionAnswerIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllFAQs } from '@/utils/api';
import { FAQItem, StrapiBlock } from '@/types/faq';

// Componente per renderizzare i blocks di Strapi
const BlocksRenderer = ({ content }: { content: StrapiBlock[] }) => {
  if (!content || content.length === 0) return null;

  return (
    <Box sx={{ 
      '& p': { mb: 2, lineHeight: 1.8 },
      '& ul, & ol': { mb: 2, pl: 3 },
      '& li': { mb: 1 },
      '& strong': { fontWeight: 600, color: 'primary.dark' },
      '& a': { 
        color: 'primary.main', 
        textDecoration: 'none',
        '&:hover': { textDecoration: 'underline' }
      }
    }}>
      {content.map((block: StrapiBlock, index: number) => {
        switch (block.type) {
          case 'paragraph':
            return (
              <Typography key={index} paragraph>
                {block.children.map((child, childIndex: number) => {
                  const key = `${index}-${childIndex}`;
                  if (child.bold) return <strong key={key}>{child.text}</strong>;
                  if (child.italic) return <em key={key}>{child.text}</em>;
                  if (child.underline) return <u key={key}>{child.text}</u>;
                  if (child.code) return <code key={key}>{child.text}</code>;
                  return <span key={key}>{child.text}</span>;
                })}
              </Typography>
            );
          case 'list':
            const ListComponent = block.format === 'ordered' ? 'ol' : 'ul';
            return (
              <ListComponent key={index}>
                {block.children.map((item, itemIndex: number) => (
                  <li key={itemIndex}>
                    {item.text}
                  </li>
                ))}
              </ListComponent>
            );
          case 'heading':
            return (
              <Typography key={index} variant={`h${block.level || 3}` as any} gutterBottom>
                {block.children[0]?.text}
              </Typography>
            );
          case 'quote':
            return (
              <Box
                key={index}
                component="blockquote"
                sx={{
                  borderLeft: 4,
                  borderColor: 'primary.main',
                  pl: 2,
                  ml: 0,
                  my: 2,
                  fontStyle: 'italic',
                  color: 'text.secondary',
                }}
              >
                <Typography>
                  {block.children[0]?.text}
                </Typography>
              </Box>
            );
          default:
            return null;
        }
      })}
    </Box>
  );
};

export default function FAQPage() {
  const theme = useTheme();
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | false>(false);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const data = await getAllFAQs();
      setFaqs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore nel caricamento delle FAQ');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    // Previeni il comportamento di scroll automatico
    event.preventDefault();
    
    // Se stiamo espandendo un accordion su mobile, salva la posizione corrente
    if (isExpanded && window.innerWidth < 768) {
      const accordionElement = event.currentTarget.closest('.MuiAccordion-root');
      if (accordionElement) {
        // Piccolo delay per permettere all'animazione di iniziare
        setTimeout(() => {
          const rect = accordionElement.getBoundingClientRect();
          // Se la parte superiore dell'accordion è fuori dalla viewport, scrolla dolcemente
          if (rect.top < 80) { // 80px per considerare l'header fisso
            window.scrollTo({
              top: window.scrollY + rect.top - 90,
              behavior: 'smooth'
            });
          }
        }, 50);
      }
    }
    
    setExpanded(isExpanded ? panel : false);
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={40} />
        <Typography sx={{ mt: 2 }}>Caricamento FAQ...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              mb: 3,
            }}
          >
            <QuestionAnswerIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          </Box>
          
          <Typography
            variant="h3"
            component="h1"
            fontWeight={700}
            gutterBottom
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Domande Frequenti
          </Typography>
          
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Trova le risposte alle domande più comuni sul Beverino Bike Festival
          </Typography>
        </Box>
      </motion.div>

      {/* FAQ Accordions */}
      <AnimatePresence>
        {faqs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="text.secondary">
                Nessuna FAQ disponibile al momento
              </Typography>
            </Paper>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, staggerChildren: 0.1 }}
          >
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Accordion
                  expanded={expanded === `panel${faq.id}`}
                  onChange={handleChange(`panel${faq.id}`)}
                  disableGutters
                  TransitionProps={{
                    unmountOnExit: false, // Mantiene il DOM per transizioni più fluide
                    timeout: 300,
                  }}
                  sx={{
                    mb: 3,
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: expanded === `panel${faq.id}` 
                      ? '0 8px 32px rgba(165, 45, 12, 0.1)' 
                      : '0 2px 8px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.3s ease',
                    '&:before': {
                      display: 'none',
                    },
                    '&:hover': {
                      boxShadow: '0 4px 16px rgba(165, 45, 12, 0.08)',
                    },
                    '&.Mui-expanded': {
                      '&:last-of-type': {
                        marginBottom: '24px',
                      },
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={
                      <ExpandMoreIcon 
                        sx={{ 
                          color: 'primary.main',
                          transition: 'transform 0.3s ease',
                        }} 
                      />
                    }
                    sx={{
                      px: 3,
                      py: 2,
                      '& .MuiAccordionSummary-content': {
                        my: 2,
                      },
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.02),
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <HelpIcon 
                        sx={{ 
                          mr: 2, 
                          color: 'primary.main',
                          fontSize: 24,
                        }} 
                      />
                      <Typography 
                        variant="h6" 
                        fontWeight={600}
                        sx={{ flex: 1 }}
                      >
                        {faq.domanda}
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  
                  <AccordionDetails
                    sx={{
                      px: 3,
                      pb: 3,
                      pt: 0,
                      bgcolor: alpha(theme.palette.grey[50], 0.5),
                      // Animazione più fluida per il contenuto
                      animation: expanded === `panel${faq.id}` 
                        ? 'fadeIn 0.3s ease-in-out' 
                        : 'none',
                      '@keyframes fadeIn': {
                        from: { opacity: 0 },
                        to: { opacity: 1 },
                      },
                    }}
                  >
                    <Box sx={{ pl: 5 }}>
                      <BlocksRenderer content={faq.risposta} />
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Paper
          sx={{
            mt: 6,
            p: 4,
            textAlign: 'center',
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.dark, 0.05)} 100%)`,
            borderRadius: 3,
          }}
        >
          <Typography variant="h6" gutterBottom fontWeight={600}>
            Non hai trovato la risposta che cercavi?
          </Typography>
          <Typography color="text.secondary" paragraph>
            Contattaci direttamente e saremo felici di aiutarti
          </Typography>
          <Button
            variant="contained"
            size="large"
            href="mailto:info@beverinobikefestival.it"
            sx={{
              mt: 2,
              borderRadius: 2,
              px: 4,
              background: 'linear-gradient(135deg, #A52D0C 0%, #D32F2F 100%)',
            }}
          >
            Contattaci
          </Button>
        </Paper>
      </motion.div>
    </Container>
  );
}