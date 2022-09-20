import { useRef, useEffect } from 'react'
import { useField } from '@unform/core'
import classNames from 'classnames';

interface Props extends React.HTMLProps<HTMLTextAreaElement> {
  name: string;
}

export default function Textarea({ name, ...rest }: Props) {
  const inputRef = useRef(null)

  const { fieldName, defaultValue, registerField, error } = useField(name)

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef,
      getValue: ref => {
        return ref.current.value
      },
      setValue: (ref, value) => {
        ref.current.value = value
      },
      clearValue: ref => {
        ref.current.value = ''
      },
    })
  }, [fieldName, registerField])

  return (
    <>
      <textarea id={fieldName} className={classNames({
        "textarea": true,
        "is-danger": error,
      })} ref={inputRef} defaultValue={defaultValue} {...rest}></textarea>

      {error && <span className="is-danger">{error}</span>}
    </>
  )
} 