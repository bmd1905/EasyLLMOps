import {
  VStack,
  HStack,
  Box,
  Text,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  useColorMode,
  Divider,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Image,
  Input,
} from '@chakra-ui/react';
import React from 'react';
import {
  Switch,
  FormControl,
} from '@chakra-ui/react';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  AtomIcon,
  TextCursorInput,
  Thermometer,
  BracesIcon,
  TerminalSquare,
  Shield,
  InfoIcon,
} from 'lucide-react';

// Import images
import groqIcon from './static/imgs/models/groq-icon.png';
import openaiIcon from './static/imgs/models/openai-icon.png';
import claudeIcon from './static/imgs/models/claude-icon.png';

const SettingsPanel = ({ settings, updateSetting }) => {
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  const { colorMode } = useColorMode();

  // Model options
  const modelOptions = [
    { value: 'groq', label: 'Groq', icon: groqIcon },
    { value: 'openai', label: 'OpenAI', icon: openaiIcon },
    { value: 'claude', label: 'Claude', icon: claudeIcon },
  ];

  // Find the selected model
  const selectedModel = modelOptions.find(
    (option) => option.value === settings.model,
  );

  return (
    <VStack spacing={6} align="stretch" width="92%" mx="auto" maxWidth="400px">
      <Text fontSize="2xl" fontWeight="bold" mb={2} pt="5">
        Run settings
      </Text>

      {/* Model Selection */}
      <SettingItem
        label="Model"
        icon={<AtomIcon size={20} />}
        tooltip="Select the AI model to use for generating responses"
      >
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            <HStack>
              {selectedModel && (
                <Image
                  src={selectedModel.icon}
                  alt={`${selectedModel.label} icon`}
                  boxSize="25px"
                />
              )}
              <Text>
                {selectedModel ? selectedModel.label : 'Select a model'}
              </Text>
            </HStack>
          </MenuButton>
          <MenuList>
            {modelOptions.map((option) => (
              <MenuItem
                key={option.value}
                icon={
                  <Image
                    src={option.icon}
                    alt={`${option.label} icon`}
                    boxSize="25px"
                  />
                }
                onClick={() => updateSetting('model', option.value)}
              >
                {option.label}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </SettingItem>

      {/* Token Count */}
      <SettingItem
        label="Token Count"
        icon={<TextCursorInput size={20} />}
        tooltip="The maximum number of tokens to generate in the response"
      >
        <Text>{settings.tokenCount} / 2,097,152</Text>
      </SettingItem>

      {/* Temperature */}
      <SettingItem
        label="Temperature"
        icon={<Thermometer size={20} />}
        tooltip="Controls the randomness of the AI's output. Higher values (closer to 1) result in more creative and unpredictable responses, while lower values (closer to 0) make the output more deterministic and focused."
      >
        <HStack spacing={4} align="center">
          <Slider
            aria-label="temperature"
            min={0}
            max={1}
            step={0.05}
            value={settings.temperature}
            onChange={(v) => updateSetting('temperature', v)}
            width="350px"
            focusThumbOnChange={false}
            _focus={{
              // boxShadow: "outline",
            }}
          >
            <SliderTrack
              bg={colorMode === 'light' ? 'gray.200' : 'gray.700'}
              borderRadius="6px"
              _hover={{
                bg: colorMode === 'light' ? 'gray.300' : 'gray.600',
              }}
            >
              <SliderFilledTrack
                bg="blue.500"
                borderRadius="6px"
              />
            </SliderTrack>
            <SliderThumb
              boxSize={6}
              bg="blue.500"
              borderWidth="2px"
              borderColor="white"
              _focus={{
                // boxShadow: "outline",
              }}
            />
          </Slider>
          {/* Use Input component to display and edit the number */}
          <Input
            value={settings.temperature.toFixed(2)}
            size="sm"
            rounded="xl"
            w="100px"
            textAlign="center"
            onChange={(e) => {
              let value = parseFloat(e.target.value);
              // Clamp the value between 0 and 1
              value = Math.max(0, Math.min(1, value));
              updateSetting('temperature', value);
            }}
          />
        </HStack>
      </SettingItem>

      {/* <Divider /> */}

      {/* JSON Mode */}
      <SettingItem
        label="JSON mode"
        icon={<BracesIcon size={20} />}
        tooltip="Output the response in JSON format"
      >
        <FormControl display="flex" alignItems="center">
          <Switch
            id="json-mode"
            pt="2"
            pl="7"
            size="md"
            isChecked={settings.jsonMode}
            onChange={(e) => updateSetting('jsonMode', e.target.checked)}
            colorScheme="blue"
          />
        </FormControl>
      </SettingItem>

      {/* Code Execution */}
      <SettingItem
        label="Code execution"
        icon={<TerminalSquare size={20} />}
        tooltip="Allow the AI to execute code snippets in the response (use with caution)"
      >
        <FormControl display="flex" alignItems="center">
          <Switch
            id="code-execution"
            pt="2"
            pl="7"
            size="md"
            isChecked={settings.codeExecution}
            onChange={(e) => updateSetting('codeExecution', e.target.checked)}
            colorScheme="blue"
          />
        </FormControl>
      </SettingItem>

      <Divider />

      {/* Advanced Settings (collapsible) */}
      <Box>
        <HStack justify="space-between" onClick={() => setShowAdvanced(!showAdvanced)}>
          <Text fontWeight="bold">Advanced settings</Text>
          {showAdvanced ? <ChevronUpIcon size={20} /> : <ChevronDownIcon size={20} />}
        </HStack>
        {showAdvanced && (
          <VStack align="stretch" mt={2} spacing={2}>
            {/* Safety Settings */}
            <SettingItem
              label="Safety settings"
              icon={<Shield size={20} />}
              tooltip="Configure safety settings for the AI's responses"
            >
              <Text fontSize="sm" color="blue.500" cursor="pointer">
                Edit safety settings
              </Text>
            </SettingItem>

            {/* Add more advanced settings here */}
          </VStack>
        )}
      </Box>
    </VStack>
  );
};

const SettingItem = ({ label, icon, tooltip, children }) => (
  <Box>
    <HStack justify="space-between" mb={2}>
      <Box flex={1}>
        <HStack>
          {icon}
          <Tooltip label={tooltip} placement="top">
            <Text fontWeight="bold">{label}</Text>
          </Tooltip>
          <InfoIcon size={16} color="gray.500" cursor="pointer" />
        </HStack>
      </Box>
    </HStack>
    {children}
  </Box>
);

export default SettingsPanel;