import Form from '@rjsf/core';
import { RJSFSchema } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';
import { useMemo } from 'react';

type MessageApi = {
  Title: string
  Description: string
  Schema: {
    Tags: RJSFSchema
  }
}

interface JsonSchemaFormProps {
  elementSize: {
    w: number
    h: number
  }
  messageApi: MessageApi
  onSubmitted: (data: object, event: unknown) => void
}

export const JsonSchemaForm = ({
  elementSize,
  messageApi,
  onSubmitted,
}: JsonSchemaFormProps) => {
  const postProcessed = useMemo(() => {
    const tagSchema = messageApi.Schema.Tags;
    const tagProperties = tagSchema.properties as Record<string, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const?: any
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      default?: any
    }>
    const tagConstProperties = Object.keys(tagProperties)
      .filter((property) => tagProperties[property].const !== undefined)

    tagConstProperties.forEach((property) => {
      tagProperties[property].default = tagProperties[property].const;
    });

    // Get UI to hide const properties
    const uiSchema = tagConstProperties.reduce((acc, property) => ({
      ...acc,
      [property]: {
        'ui:widget': 'hidden',
      },
    }), {});

    return {
      schema: tagSchema,
      uiSchema,
    }
  }, [messageApi.Schema.Tags])

  return (
    <div
      style={{
        width: `${elementSize.w}px`,
        height: `${elementSize.h}px`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        border: '1px solid black',
      }}
    >
      <h2>{messageApi.Title}</h2>
      <h3>{messageApi.Description}</h3>
      <Form
        {...postProcessed}
        validator={validator}
        onSubmit={onSubmitted}
        showErrorList={false}
        // onChange={console.log('changed')}
        // onError={console.log('errors')}
      />
    </div>
  );
}


