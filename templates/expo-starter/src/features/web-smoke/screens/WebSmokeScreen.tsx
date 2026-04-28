import React, { useState } from 'react';
import {
  AppButton,
  AppInput,
  AppScrollView,
  AppText,
  AppView,
  DatePicker,
  PageDrawer,
  Picker,
  Select,
  Slider,
  useAlert,
  useLoading,
  useToast,
  type PickerValue,
} from '@gaozh1024/rn-kit';

const selectOptions = [
  { label: 'Alpha', value: 'alpha' },
  { label: 'Beta', value: 'beta' },
  { label: 'Gamma', value: 'gamma' },
];

const pickerColumns = [
  {
    key: 'platform',
    title: 'Platform',
    options: [
      { label: 'iOS', value: 'ios' },
      { label: 'Android', value: 'android' },
      { label: 'Web', value: 'web' },
    ],
  },
  {
    key: 'mode',
    title: 'Mode',
    options: [
      { label: 'Light', value: 'light' },
      { label: 'Dark', value: 'dark' },
    ],
  },
];

export function WebSmokeScreen() {
  const toast = useToast();
  const alert = useAlert();
  const loading = useLoading();
  const [inputValue, setInputValue] = useState('rn-kit web');
  const [selectValue, setSelectValue] = useState<string | string[]>('alpha');
  const [pickerValue, setPickerValue] = useState<PickerValue[]>(['web', 'light']);
  const [dateValue, setDateValue] = useState(new Date(2024, 0, 2));
  const [sliderValue, setSliderValue] = useState(40);
  const [drawerVisible, setDrawerVisible] = useState(false);

  return (
    <AppScrollView testID="web-smoke-screen" surface="background" p={4}>
      <AppView gap={4}>
        <AppText size="2xl" weight="bold">
          rn-kit Web Smoke
        </AppText>
        <AppText tone="muted">
          This screen imports rn-kit from the package entry and renders representative Web-sensitive
          components.
        </AppText>

        <AppInput
          placeholder="Input"
          value={inputValue}
          onChangeText={setInputValue}
          testID="web-smoke-input"
        />

        <Select
          value={selectValue}
          onChange={setSelectValue}
          options={selectOptions}
          searchable
          clearable
        />

        <Picker value={pickerValue} onChange={setPickerValue} columns={pickerColumns} />

        <DatePicker
          value={dateValue}
          minDate={new Date(2024, 0, 1)}
          maxDate={new Date(2024, 11, 31)}
          onChange={setDateValue}
        />

        <Slider value={sliderValue} onChange={setSliderValue} showTooltip />

        <AppView row wrap gap={2}>
          <AppButton onPress={() => toast.success('Toast works on Web')}>Toast</AppButton>
          <AppButton onPress={() => alert.alert({ title: 'Alert', message: 'Alert works on Web' })}>
            Alert
          </AppButton>
          <AppButton
            onPress={() => {
              loading.show('Loading works on Web');
              setTimeout(() => loading.hide(), 300);
            }}
          >
            Loading
          </AppButton>
          <AppButton onPress={() => setDrawerVisible(true)}>Drawer</AppButton>
        </AppView>
      </AppView>

      <PageDrawer
        visible={drawerVisible}
        title="Web Drawer"
        onClose={() => setDrawerVisible(false)}
      >
        <AppText>PageDrawer.web renders as a viewport modal drawer.</AppText>
      </PageDrawer>
    </AppScrollView>
  );
}
