import { t } from '@lingui/core/macro';
import {
  Badge,
  Box,
  Grid,
  Group,
  Image,
  Paper,
  Stack,
  Text,
  Title
} from '@mantine/core';
import { IconPalette } from '@tabler/icons-react';
import { type ReactNode, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { ApiEndpoints } from '@lib/enums/ApiEndpoints';
import { PageDetail } from '../../components/nav/PageDetail';
import { useInstance } from '../../hooks/UseInstance';
import { PartListTable } from '../../tables/part/PartTable';

interface CorRecord {
  pk: number;
  nome_pt: string;
  nome_en: string;
  pantone?: string;
  hex_code?: string;
  textura?: string;
  textura_url?: string;
}

/**
 * Build the Pantone chip image URL from a color code, replicating the
 * logic used in the colors table (spaces → "-", lowercase).
 */
function pantoneChipUrl(pantone: string): string {
  const code = pantone.replace(/\s+/g, '-').toLowerCase();
  return `https://www.pantone.com/media/color-finder/img/chips/pantone-color-chip-${code}.webp`;
}

/**
 * Single info row (label + value) for the details column.
 */
function InfoRow({
  label,
  children
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <Group justify='space-between' wrap='nowrap' align='flex-start'>
      <Text size='sm' c='dimmed'>
        {label}
      </Text>
      <Box style={{ textAlign: 'right' }}>{children}</Box>
    </Group>
  );
}

export default function ColorDetail() {
  const { id } = useParams();

  const { instance, instanceQuery } = useInstance<CorRecord>({
    endpoint: ApiEndpoints.cor_list,
    pk: id
  });

  // Determine the large image to show: Pantone chip → texture → hex swatch
  const preview = useMemo(() => {
    if (instance?.pantone) {
      return (
        <Image
          src={pantoneChipUrl(instance.pantone)}
          radius='md'
          fit='contain'
          h={320}
          w='100%'
          alt={instance.pantone}
        />
      );
    }
    if (instance?.textura_url) {
      return (
        <Image
          src={instance.textura_url}
          radius='md'
          fit='cover'
          h={320}
          w='100%'
          alt={instance.nome_pt}
        />
      );
    }
    return (
      <Box
        style={{
          height: 320,
          width: '100%',
          borderRadius: 8,
          background: instance?.hex_code ?? '#eee',
          border: '1px solid #ccc'
        }}
      />
    );
  }, [instance]);

  return (
    <Stack gap='xs'>
      <PageDetail
        title={instance?.nome_pt ?? t`Cor`}
        subtitle={instance?.nome_en}
        icon={<IconPalette />}
        breadcrumbs={[{ name: t`Cores`, url: '/cores' }]}
      />

      <Paper p='md' withBorder>
        <Grid gutter='xl'>
          <Grid.Col span={{ base: 12, md: 5 }}>{preview}</Grid.Col>
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Stack gap='sm'>
              <Title order={4}>{instance?.nome_pt}</Title>
              <InfoRow label={t`Nome (PT)`}>
                <Text>{instance?.nome_pt}</Text>
              </InfoRow>
              <InfoRow label={t`Name (EN)`}>
                <Text>{instance?.nome_en}</Text>
              </InfoRow>
              <InfoRow label={t`Pantone`}>
                {instance?.pantone ? (
                  <Badge variant='outline' color='gray'>
                    {instance.pantone}
                  </Badge>
                ) : (
                  <Text c='dimmed'>—</Text>
                )}
              </InfoRow>
              <InfoRow label={t`Código Hex`}>
                {instance?.hex_code ? (
                  <Group gap='xs' justify='flex-end'>
                    <Box
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: 3,
                        background: instance.hex_code,
                        border: '1px solid #ccc'
                      }}
                    />
                    <Text ff='monospace' size='sm'>
                      {instance.hex_code}
                    </Text>
                  </Group>
                ) : (
                  <Text c='dimmed'>—</Text>
                )}
              </InfoRow>
            </Stack>
          </Grid.Col>
        </Grid>
      </Paper>

      <Title order={5} mt='md'>
        {t`Produtos que usam esta cor`}
      </Title>
      {instanceQuery.isSuccess && instance?.pk && (
        <PartListTable
          enableImport={false}
          tableName='cor-parts'
          props={{ params: { cor: instance.pk } }}
        />
      )}
    </Stack>
  );
}
