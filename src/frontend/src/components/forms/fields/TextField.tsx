import { Textarea, TextInput } from '@mantine/core';
import { useCallback, useEffect, useId, useMemo, useState } from 'react';
import type { FieldValues, UseControllerReturn } from 'react-hook-form';
import AutoFillRightSection from './AutoFillRightSection';

/*
 * Custom implementation of the mantine <TextInput> component,
 * used for rendering text input fields in forms.
 * Uses a debounced value to prevent excessive re-renders.
 */
export default function TextField({
  controller,
  fieldName,
  definition,
  placeholderAutofill,
  onChange,
  onKeyDown
}: Readonly<{
  controller: UseControllerReturn<FieldValues, any>;
  definition: any;
  fieldName: string;
  placeholderAutofill?: boolean;
  onChange: (value: any) => void;
  onKeyDown: (value: any) => void;
}>) {
  const fieldId = useId();
  const {
    field,
    fieldState: { error }
  } = controller;

  const { value } = useMemo(() => field, [field]);

  const [textValue, setTextValue] = useState<string>(value || '');

  const onTextChange = useCallback(
    (value: any) => {
      setTextValue(value);
      onChange(value);
    },
    [onChange]
  );

  useEffect(() => {
    setTextValue(value || '');
  }, [value]);

  /* Construct a "cut-down" version of the definition,
   * which does not include any attributes that the lower components do not recognize
   */
  const fieldDefinition = useMemo(() => {
    return {
      ...definition,
      allow_blank: undefined,
      // 'multiline' is a custom flag (not a DOM prop) - strip before spreading
      multiline: undefined
    };
  }, [definition]);

  const commonProps = {
    ...fieldDefinition,
    ref: field.ref,
    id: fieldId,
    'aria-label': `text-field-${field.name}`,
    value: textValue || '',
    error: definition.error ?? error?.message,
    radius: 'sm' as const,
    onChange: (event: any) => onTextChange(event.currentTarget.value),
    onBlur: (event: any) => {
      if (event.currentTarget.value != textValue) {
        onTextChange(event.currentTarget.value);
      }
    },
    onKeyDown: (event: any) => {
      if (event.code === 'Enter' && !definition.multiline) {
        // Bypass debounce on enter key (single-line only)
        onTextChange(event.currentTarget.value);
      }
      onKeyDown(event.code);
    }
  };

  // Long text fields render as a manually resizable textarea (drag handle)
  if (definition.multiline) {
    return (
      <Textarea
        {...commonProps}
        rows={5}
        styles={{ input: { resize: 'vertical' } }}
      />
    );
  }

  return (
    <TextInput
      {...commonProps}
      type={definition.field_type}
      rightSection={
        placeholderAutofill && (
          <AutoFillRightSection
            value={textValue}
            fieldName={field.name}
            definition={definition}
            onChange={onChange}
          />
        )
      }
    />
  );
}
