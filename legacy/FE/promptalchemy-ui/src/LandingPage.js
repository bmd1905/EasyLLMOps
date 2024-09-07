import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Image,
  VStack,
  SimpleGrid,
  useColorModeValue,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
} from '@chakra-ui/react';
import { motion, useViewportScroll, useTransform, useAnimation } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const MotionBox = motion(Box);
const MotionButton = motion(Button);
const MotionHeading = motion(Heading);
const MotionText = motion(Text);

// Placeholder components
const TypingEffect = ({ text }) => <Text>{text}</Text>;
const Testimonials = () => <Box></Box>;
const InteractiveDemo = () => <Box></Box>;

const EasyLLMOpsLanding = () => {
  const bgGradient = useColorModeValue('linear(to-br, purple.100, indigo.100)', 'linear(to-br, purple.200, indigo.200)');
  const cardBg = useColorModeValue('whiteAlpha.800', 'whiteAlpha.900');
  const textColor = useColorModeValue('gray.800', 'gray.100');

  const { scrollYProgress } = useViewportScroll();
  const yRange = useTransform(scrollYProgress, [0, 1], [0, 100]);

  const controls = useAnimation();

  useEffect(() => {
    controls.start(i => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.3 }
    }));

    // Performance tracking
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      console.log('Component mount time:', endTime - startTime);
    };
  }, [controls]);

  return (
    <Box minH="100vh" color={textColor} overflow="hidden">
      <Helmet>
        <title>EasyLLMOps - Transform Your Prompts</title>
        <meta name="description" content="EasyLLMOps helps you transform basic queries into sophisticated prompts for exceptional results with AI language models." />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "EasyLLMOps",
              "url": "https://easyllmops.com",
              "description": "Transform basic queries into sophisticated prompts for exceptional results with AI language models."
            }
          `}
        </script>
      </Helmet>

      <MotionBox
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgGradient={bgGradient}
        style={{ y: yRange }}
      />
      <Container maxW="container.xl" py={6} position="relative">
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Image
            src="/static/logo/logo-transparent.png"
            alt="EasyLLMOps Logo"
            pt="inherit"
            width="250px"
            height="250px"
          />
        </MotionBox>

        <VStack spacing={10} align="center" justify="center" py={20}>
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <MotionHeading
              as="h2"
              size="2xl"
              textAlign="center"
              mb={4}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <TypingEffect text="Unleash the Full Potential of Your Prompts" />
            </MotionHeading>
            <MotionText
              fontSize="xl"
              textAlign="center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.7 }}
            >
              Transform basic queries into sophisticated prompts for exceptional results.
            </MotionText>
          </MotionBox>

          <MotionBox
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Image
            //   src="/api/placeholder/800/400"
                src="/static/pipeline.png"
                alt="Prompt transformation visualization"
                borderRadius="lg"
                shadow="xl"
                loading="lazy"
                mx="auto"
                width="80%"
                height="auto"
                p={4}
            />
          </MotionBox>

          <MotionButton
            as={RouterLink}
            to="/chat"
            colorScheme="purple"
            size="lg"
            rounded="full"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            aria-label="Start crafting better prompts"
          >
            Start Crafting Better Prompts
          </MotionButton>
        </VStack>

        <MotionBox
          py={20}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <MotionHeading
            as="h3"
            size="xl"
            textAlign="center"
            mb={8}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, amount: 0.8 }}
          >
            Key Features
          </MotionHeading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
            {[
              { title: "Intuitive API", description: "Easily integrate EasyLLMOps into your projects." },
              { title: "Versatile Techniques", description: "Apply a range of prompt engineering strategies." },
              { title: "Customizable", description: "Tailor the transformation process to your specific needs." },
              { title: "Open-source", description: "Contribute to the development and benefit from the community." },
            ].map((feature, index) => (
              <MotionBox
                key={index}
                bg={cardBg}
                p={6}
                borderRadius="lg"
                boxShadow="md"
                initial={{ opacity: 0, y: 20 }}
                custom={index}
                animate={controls}
                whileHover={{ scale: 1.05 }}
              >
                <Heading as="h4" size="md" mb={2}>{feature.title}</Heading>
                <Text>{feature.description}</Text>
              </MotionBox>
            ))}
          </SimpleGrid>
        </MotionBox>

        <Testimonials />
        <InteractiveDemo />

        <Accordion allowMultiple width="100%" maxW="800px" mx="auto" mt={20}>
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  What is EasyLLMOps?
                </Box>
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              EasyLLMOps is a tool that helps you transform basic queries into sophisticated prompts for better results when working with AI language models.
            </AccordionPanel>
          </AccordionItem>
          {/* Add more FAQ items here */}
        </Accordion>
      </Container>

      <Box py={6} textAlign="center" position="relative">
        <Text>&copy; 2024 EasyLLMOps. All rights reserved.</Text>
      </Box>
    </Box>
  );
};

export default React.memo(EasyLLMOpsLanding);
