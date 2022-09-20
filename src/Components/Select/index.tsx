import React, { useRef, useEffect } from "react";
import ReactSelect, { Props as SelectProps } from "react-select";
import { useField } from "@unform/core";
import classNames from "classnames";

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
      getValue: (ref) => {
        try {
          return ref.state.selectValue[0].id;
        } catch (err) {
          return null;
        }
      },
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
      <ReactSelect ref={selectRef} className={classNames({
        "is-danger": error
      })} defaultValue={defaultValue} {...rest} />
      {error && <span className="is-danger">{error}</span>}
    </>
  )
}
