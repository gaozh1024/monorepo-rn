/**
 * @panther-expo/ui - UI 组件库
 *
 * 基于 Gluestack UI + NativeWind 的 Expo 组件库
 * 提供一套标准化的、可主题化的 UI 组件
 *
 * @example
 * ```typescript
 * import { Button, Input, Card } from '@panther-expo/ui';
 *
 * // 使用组件
 * <Button action="primary" variant="solid">
 *   <ButtonText>点击我</ButtonText>
 * </Button>
 * ```
 *
 * @example
 * // 自定义主题
 * // 在 tailwind.config.js 中配置颜色
 * const { gluestackColors } = require('@panther-expo/theme/colors');
 *
 * module.exports = {
 *   theme: {
 *     extend: {
 *       colors: gluestackColors({
 *         primary: '#f38b32',
 *         secondary: '#4A5568',
 *         success: '#52C41A',
 *         error: '#FF4D4F',
 *         warning: '#FAAD14',
 *         info: '#1890FF',
 *       })
 *     }
 *   }
 * }
 * ```
 */

// ==================== Provider ====================
export { GluestackUIProvider } from './components/gluestack-ui-provider';

// ==================== 布局 ====================
export { Box } from './components/box';
export { Card } from './components/card';
export { Center } from './components/center';
export { Divider } from './components/divider';
export { Grid } from './components/grid';
export { HStack } from './components/hstack';
export { VStack } from './components/vstack';

// ==================== 表单 ====================
export {
  Button,
  ButtonText,
  ButtonSpinner,
  ButtonIcon,
  ButtonGroup,
} from './components/button';
export { Checkbox } from './components/checkbox';
export { Radio } from './components/radio';
export { Select } from './components/select';
export { Slider } from './components/slider';
export { Switch } from './components/switch';
export { Input, InputField, InputIcon, InputSlot } from './components/input';
export { Textarea } from './components/textarea';
export { FormControl } from './components/form-control';

// ==================== 反馈 ====================
export { Alert } from './components/alert';
export { AlertDialog } from './components/alert-dialog';
export { Skeleton } from './components/skeleton';
export { Spinner } from './components/spinner';
export { Toast, ToastTitle, ToastDescription, useToast } from './components/toast';
export { Tooltip } from './components/tooltip';

// ==================== 导航 ====================
export { Actionsheet } from './components/actionsheet';
export { BottomSheet } from './components/bottomsheet';
export { Drawer } from './components/drawer';
export { Menu } from './components/menu';
export { Modal } from './components/modal';
export { Popover } from './components/popover';
export { Portal } from './components/portal';

// ==================== 展示 ====================
export { Accordion } from './components/accordion';
export { Avatar } from './components/avatar';
export { Badge } from './components/badge';
export { Fab } from './components/fab';
export { Heading } from './components/heading';
export { Image } from './components/image';
export { Link } from './components/link';
export { Table } from './components/table';
export { Text } from './components/text';
export * from './components/icon';

// ==================== 其他 ====================
export { Pressable } from './components/pressable';
