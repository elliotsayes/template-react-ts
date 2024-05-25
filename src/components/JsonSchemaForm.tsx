import Form from '@rjsf/core';
import { RJSFSchema } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';
import { useMemo } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const log = (type: any) => console.log.bind(console, type);

type MessageApi = {
  Title: string
  Description: string
  Schema: {
    Tags: RJSFSchema
  }
}

interface JsonSchemaFormProps {
  messageApi: MessageApi
  onSubmitted: (data: object, event: unknown) => void
}

export const JsonSchemaForm = ({
  messageApi,
  onSubmitted,
}: JsonSchemaFormProps) => {
  const postProcessed = useMemo(() => {
    const tagSchema = messageApi.Schema.Tags;
    const tagProperties = tagSchema.properties as Record<string, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const?: any
    }>
    const tagConstProperties = Object.keys(tagProperties)
      .filter((property) => tagProperties[property].const !== undefined)

    // Created modified properties with default values addeed when const is specified
    const tagSchemaPropertiesModified = {
      ...tagSchema.properties,
      ...tagConstProperties.reduce((acc, property) => ({
        ...acc,
        [property]: {
          ...tagProperties[property],
          ...(
            tagConstProperties.includes(property) && {
              default: tagProperties[property].const,
            }
          )
        },
      }), {}),
    }

    // Get UI to hide const properties
    const uiSchema = tagConstProperties.reduce((acc, property) => ({
      ...acc,
      [property]: {
        'ui:widget': 'hidden',
      },
    }), {});
    
    const schema = {
      ...tagSchema,
      properties: tagSchemaPropertiesModified,
    }

    return {
      schema,
      uiSchema,
    }
  }, [messageApi.Schema.Tags])

  return (
    <div>
      <h1>{messageApi.Title}</h1>
      <h2>{messageApi.Description}</h2>
      <Form
        {...postProcessed}
        validator={validator}
        onChange={log('changed')}
        onSubmit={onSubmitted}
        onError={log('errors')}
        showErrorList={false}
      />
    </div>
  );
}


