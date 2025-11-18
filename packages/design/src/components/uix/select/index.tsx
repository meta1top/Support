import { forwardRef, type MouseEvent, type ReactNode, useState } from "react";
import { XIcon } from "lucide-react";

import { Empty } from "@meta-1/design/components/uix/empty";
import { cn } from "@meta-1/design/lib";
import { SelectContent, SelectItem, SelectTrigger, SelectValue, Select as UISelect } from "../../ui/select";

export type SelectValueType = string | number;

export interface SelectOptionProps {
  value: SelectValueType;
  label: ReactNode;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOptionProps[];
  value?: SelectValueType;
  defaultValue?: string;
  onChange?: (value: SelectValueType) => void;
  placeholder?: string;
  className?: string;
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  align?: "start" | "center" | "end";
  alignOffset?: number;
  empty?: ReactNode;
  allowClear?: boolean;
  triggerClassName?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>((props, _ref) => {
  const {
    options = [],
    value,
    defaultValue,
    onChange,
    placeholder,
    className,
    empty,
    allowClear,
    triggerClassName,
    open,
    onOpenChange,
    ...rest
  } = props;

  const [innerValue, setInnerValue] = useState<string | undefined>(defaultValue);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : innerValue;

  const handleChange = (val: string) => {
    if (onChange) {
      // 尝试找到原始选项,返回原始类型的 value
      const option = options.find((opt) => String(opt.value) === val);
      if (option) {
        onChange(option.value);
      }
    }
    if (!isControlled) {
      setInnerValue(val);
    }
  };

  const clear = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    handleChange("");
  };

  return (
    <UISelect
      {...rest}
      defaultValue={defaultValue}
      onOpenChange={onOpenChange}
      onValueChange={handleChange}
      open={open}
      value={currentValue !== undefined ? String(currentValue) : undefined}
    >
      <div className={cn("relative inline-block", allowClear && currentValue ? "group" : "", className)}>
        <SelectTrigger className={cn("flex w-full", triggerClassName)}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        {allowClear && currentValue && (
          <div
            className="absolute top-0 right-0 z-50 hidden h-full cursor-pointer items-center justify-center px-3 group-hover:flex"
            onClick={clear}
          >
            <XIcon className="size-4 opacity-50" />
          </div>
        )}
      </div>
      <SelectContent
        align={props.align}
        alignOffset={props.alignOffset}
        side={props.side}
        sideOffset={props.sideOffset}
      >
        {options?.length
          ? options.map((option) => (
              <SelectItem disabled={option.disabled} key={option.value} value={String(option.value)}>
                {option.label}
              </SelectItem>
            ))
          : empty || <Empty />}
      </SelectContent>
    </UISelect>
  );
});
