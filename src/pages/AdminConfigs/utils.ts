import { FormHandles } from '@unform/core';
import { RefObject } from 'react';
import * as Yup from 'yup';

export async function validatePost(data: {}, form: RefObject<FormHandles>) {
  form.current?.setErrors({})

  const schema = Yup.object().shape({
    label: Yup.string()
      .min(5, 'O local deve ter mais de 5 caracteres')
      .max(64, 'O local deve ter menos de 64 caracteres')
      .required('Este campo é obrigatório')
  })

  await schema.validate(data, {
    abortEarly: false,
  })
}

export async function validateDelete(data: {}, form: RefObject<FormHandles>) {
  form.current?.setErrors({})

  const schema = Yup.object().shape({
    localId: Yup.string().required()
  })

  await schema.validate(data, {
    abortEarly: false,
  })
}

export async function passErrors(err: Yup.ValidationError, form: RefObject<FormHandles>) {
  const validationErrors: any = {}
  
  err.inner.forEach(error => {
    const path = String(error.path);
    validationErrors[path] = error.message;
  });

  form.current?.setErrors(validationErrors);
}