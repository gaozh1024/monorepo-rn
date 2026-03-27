import { AppView } from '@/ui/primitives';
import { Radio } from './Radio';
import { isGroupOptionDisabled, type FormGroupOption } from './group';
import { type CommonLayoutProps, type LayoutSurface } from '../utils/layout-shortcuts';

export interface RadioGroupProps extends Pick<
  CommonLayoutProps,
  | 'flex'
  | 'wrap'
  | 'center'
  | 'between'
  | 'items'
  | 'justify'
  | 'p'
  | 'px'
  | 'py'
  | 'pt'
  | 'pb'
  | 'pl'
  | 'pr'
  | 'm'
  | 'mx'
  | 'my'
  | 'mt'
  | 'mb'
  | 'ml'
  | 'mr'
  | 'gap'
  | 'rounded'
  | 'w'
  | 'h'
  | 'minW'
  | 'minH'
  | 'maxW'
  | 'maxH'
> {
  value?: string;
  onChange?: (value: string) => void;
  options?: FormGroupOption[];
  direction?: 'row' | 'column';
  disabled?: boolean;
  bg?: string;
  surface?: LayoutSurface;
  className?: string;
}

export function RadioGroup({
  flex,
  wrap,
  center,
  between,
  items,
  justify,
  p,
  px,
  py,
  pt,
  pb,
  pl,
  pr,
  m,
  mx,
  my,
  mt,
  mb,
  ml,
  mr,
  gap,
  rounded,
  w,
  h,
  minW,
  minH,
  maxW,
  maxH,
  value,
  onChange,
  options = [],
  direction = 'column',
  disabled = false,
  bg,
  surface,
  className,
}: RadioGroupProps) {
  const isRow = direction === 'row';

  return (
    <AppView
      flex={flex ?? (isRow ? true : undefined)}
      row={isRow}
      wrap={wrap}
      center={center}
      between={between}
      items={items}
      justify={justify}
      p={p}
      px={px}
      py={py}
      pt={pt}
      pb={pb}
      pl={pl}
      pr={pr}
      m={m}
      mx={mx}
      my={my}
      mt={mt}
      mb={mb}
      ml={ml}
      mr={mr}
      gap={gap ?? 4}
      rounded={rounded}
      w={w}
      h={h}
      minW={minW}
      minH={minH}
      maxW={maxW}
      maxH={maxH}
      bg={bg}
      surface={surface}
      className={className}
    >
      {options.map(option => (
        <Radio
          key={option.value}
          checked={value === option.value}
          onChange={() => onChange?.(option.value)}
          disabled={isGroupOptionDisabled(disabled, option.disabled)}
        >
          {option.label}
        </Radio>
      ))}
    </AppView>
  );
}
