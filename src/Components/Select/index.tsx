import React, { useRef, useEffect } from "react";
import ReactSelect, { Props as SelectProps } from "react-select";
import { useField } from "@unform/core";

interface Props extends SelectProps {
  name: string;
}

export function Select({ name, ...rest }: Props) {
  const selectRef = useRef(null);

  const { fieldName, defaultValue, registerField, error } = useField(name)

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: selectRef.current,
      getValue: (ref) => ref.state.selectValue[0].id,
      setValue: (ref, value) => {
        ref.select.setValue(value || null);
      },
      clearValue: (ref) => {
        ref.select.clearValue();
      }
    });
  }, [fieldName, registerField]);

  return (
    <>
      <ReactSelect ref={selectRef} defaultValue={defaultValue} {...rest} />
      {error && <span className="is-danger">{error}</span>}
    </>
  )
}
