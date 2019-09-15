import React, { useState } from 'react'
import styled from 'styled-components'

import svgr from '@svgr/core'
import Code from '../Code'
import prettier from 'prettier'
import svgo from '../svgo'
import {
  unstable_FormCheckbox as FormCheckbox,
  unstable_useFormState as useFormState,
  unstable_Form as Form,
  unstable_FormLabel as FormLabel,
  unstable_FormInput as FormInput,
  unstable_FormMessage as FormMessage,
  unstable_FormSubmitButton as FormSubmitButton
} from 'reakit/Form'

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  margin-top: 20px;

  textarea {
    min-height: 200px;
  }

  textarea,
  input {
    color: white;
    background: #444343;
    border: none;
    padding: 8px;
    margin-bottom: 20px;
  }
`

const Submit = styled(FormSubmitButton)`
  padding: 8px 12px;
  background: transparent;
  color: #fff;
  border: 1px solid #444343;
  margin-right: 20px;
  font-size: 14px;
  transition: all 200ms ease;
  border-radius: 4px;
  width: 100%;
  text-transform: uppercase;
`

export default () => {
  const [jsCode, setJSCode] = useState()
  const form = useFormState({
    values: { svgCode: '', native: false, name: 'Icon', icon: false },
    onValidate: values => {
      if (!values.svgCode) {
        const errors = {
          svgCode: 'You need to paste some SVG code'
        }
        throw errors
      }
    },
    onSubmit: async values => {
      const svgoCode = await svgo(values.svgCode)
      svgr(svgoCode, values, { componentName: values.name }).then(
        async code => {
          setJSCode(
            prettier.format(code, {
              parser: 'babel'
            })
          )
        }
      )
    }
  })
  return (
    <>
      <StyledForm {...form}>
        <FormLabel {...form} name="name">
          Component Name
        </FormLabel>
        <FormInput {...form} name="name" placeholder="Icon" />
        <label>
          <FormCheckbox {...form} name="icon" value="icon" /> Hide Dimensions
        </label>
        <label>
          <FormCheckbox {...form} name="native" value="native" /> React Native
        </label>
        <FormLabel {...form} name="svgCode">
          SVG Code
        </FormLabel>
        <FormInput
          {...form}
          name="svgCode"
          placeholder="Please paste your svg code here"
          as="textarea"
        />
        <FormMessage {...form} name="svgCode" />
        <Submit {...form}>Submit</Submit>
      </StyledForm>
      {jsCode ? <Code code={jsCode}> </Code> : null}
    </>
  )
}
