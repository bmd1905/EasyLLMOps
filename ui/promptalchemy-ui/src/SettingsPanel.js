import React from 'react';
import {
  VStack,
  HStack,
  Box,
  Text,
  Switch,
  Select,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useColorMode,
  Divider,
} from '@chakra-ui/react';
import {
  AtomIcon,
  TextCursorInput,
  Thermometer,
  BracesIcon,
  TerminalSquare,
  Shield,
  ChevronDownIcon,
  ChevronUpIcon,
} from 'lucide-react';

const SettingsPanel = ({ settings, updateSetting }) => {
  const { colorMode } = useColorMode();
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  return (
    <VStack spacing={6} align="stretch" width="100%" maxWidth="450px">
      <Text fontSize="2xl" fontWeight="bold" mb={2}>
        Run settings
      </Text>

      {/* Model Selection */}
      <SettingItem label="Model" icon={<AtomIcon size={20} />}>
        <Select
          value={settings.model}
          onChange={(e) => updateSetting('model', e.target.value)}
          bg={colorMode === 'dark' ? 'gray.700' : 'white'}
        >
          <option value="Gemini 1.5 Pro Exper">Gemini 1.5 Pro Exper</option>
          <option value="Other Model">Other Model</option>
        </Select>
      </SettingItem>

      {/* Token Count */}
      <SettingItem label="Token Count" icon={<TextCursorInput size={20} />}>
        <Text>{settings.tokenCount} / 2,097,152</Text>
      </SettingItem>

      {/* Temperature */}
      <SettingItem label="Temperature" icon={<Thermometer size={20} />}>
        <HStack>
          <NumberInput
            size="sm"
            value={settings.temperature}
            onChange={(v) => updateSetting('temperature', v)}
            min={0}
            max={1}
            step={0.1}
            precision={1}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Slider
            min={0}
            max={1}
            step={0.05}
            value={settings.temperature}
            onChange={(v) => updateSetting('temperature', v)}
            colorScheme="blue"
            width="350px" // Adjust width as needed
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </HStack>
      </SettingItem>

      <Divider />

      {/* JSON Mode */}
      <SettingItem label="JSON mode" icon={<BracesIcon size={20} />}>
        <Switch
          isChecked={settings.jsonMode}
          onChange={(e) => updateSetting('jsonMode', e.target.checked)}
          colorScheme="blue"
        />
      </SettingItem>

      {/* Code Execution */}
      <SettingItem label="Code execution" icon={<TerminalSquare size={20} />}>
        <Switch
          isChecked={settings.codeExecution}
          onChange={(e) => updateSetting('codeExecution', e.target.checked)}
          colorScheme="blue"
        />
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
            <SettingItem label="Safety settings" icon={<Shield size={20} />}>
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

// Helper component for each setting item
const SettingItem = ({ label, icon, children }) => (
  <Box>
    <HStack justify="space-between" mb={2}>
      <HStack>
        {icon}
        <Text fontWeight="bold">{label}</Text>
      </HStack>
    </HStack>
    {children}
  </Box>
);

export default SettingsPanel;