import { Box } from '@mantine/core';
import type { ReactNode } from 'react';

import { ModelType } from '@lib/enums/ModelType';
import { getDetailUrl } from '@lib/functions/Navigation';
import { type InstanceRenderInterface, RenderInlineModel } from './Instance';

/**
 * Inline rendering of a single Cor (color) instance
 */
export function RenderCor(props: Readonly<InstanceRenderInterface>): ReactNode {
  const { instance } = props;

  if (!instance) {
    return '';
  }

  // Colored square filled with the hex code, shown to the left of the name
  const swatch = instance.hex_code ? (
    <Box
      style={{
        width: 16,
        height: 16,
        borderRadius: 3,
        background: instance.hex_code,
        border: '1px solid #ccc',
        flexShrink: 0
      }}
    />
  ) : undefined;

  return (
    <RenderInlineModel
      {...props}
      prefix={swatch}
      primary={instance.nome_pt}
      secondary={instance.pantone || instance.nome_en}
      image={instance.hex_code ? undefined : instance.textura_url}
      url={
        props.link ? getDetailUrl(ModelType.cor, instance.pk) : undefined
      }
    />
  );
}
