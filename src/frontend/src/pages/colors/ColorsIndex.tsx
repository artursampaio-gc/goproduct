import { t } from '@lingui/core/macro';
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  ColorInput,
  FileInput,
  Group,
  Image,
  Modal,
  Radio,
  Stack,
  Text,
  TextInput,
  Tooltip
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {
  IconEdit,
  IconPalette,
  IconPhoto,
  IconTrash
} from '@tabler/icons-react';
import { useCallback, useMemo, useState } from 'react';

import { AddItemButton } from '@lib/components/AddItemButton';
import { ApiEndpoints } from '@lib/enums/ApiEndpoints';
import { ModelType } from '@lib/enums/ModelType';
import { apiUrl } from '@lib/functions/Api';
import useTable from '@lib/hooks/UseTable';
import type { TableColumn } from '@lib/types/Tables';
import { useApi } from '../../contexts/ApiContext';
import { PageDetail } from '../../components/nav/PageDetail';
import { InvenTreeTable } from '../../tables/InvenTreeTable';

// ── Tipos ──────────────────────────────────────────────────────────────────

interface CorFormValues {
  nome_pt: string;
  nome_en: string;
  pantone: string;
  color_type: 'hex' | 'textura' | 'ambos';
  hex_code: string;
  textura: File | null;
}

interface CorRecord {
  pk: number;
  nome_pt: string;
  nome_en: string;
  pantone?: string;
  hex_code?: string;
  textura?: string;
  textura_url?: string;
}

// ── Formulário de Cor ───────────────────────────────────────────────────────

function CorModal({
  opened,
  onClose,
  onSuccess,
  initial
}: {
  opened: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initial?: CorRecord | null;
}) {
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CorFormValues>({
    initialValues: {
      nome_pt: initial?.nome_pt ?? '',
      nome_en: initial?.nome_en ?? '',
      pantone: initial?.pantone ?? '',
      color_type: initial?.hex_code ? (initial?.textura ? 'ambos' : 'hex') : (initial?.textura ? 'textura' : 'hex'),
      hex_code: initial?.hex_code ?? '',
      textura: null
    },
    validate: {
      nome_pt: (v) => (!v.trim() ? t`Nome em português é obrigatório` : null),
      nome_en: (v) => (!v.trim() ? t`Name in English is required` : null),
      hex_code: (v, vals) => {
        if (vals.color_type !== 'textura' && !v.trim()) return t`Código Hex é obrigatório`;
        if (v && !/^#?[0-9A-Fa-f]{6}$/.test(v)) return t`Formato inválido. Use #RRGGBB`;
        return null;
      },
      textura: (v, vals) => {
        if (vals.color_type !== 'hex' && !v && !initial?.textura) return t`Selecione uma imagem de textura`;
        return null;
      }
    }
  });

  const colorType = form.values.color_type;
  const showHex = colorType === 'hex' || colorType === 'ambos';
  const showTextura = colorType === 'textura' || colorType === 'ambos';

  const handleSubmit = async (values: CorFormValues) => {
    setLoading(true);
    setError(null);

    try {
      const data = new FormData();
      data.append('nome_pt', values.nome_pt);
      data.append('nome_en', values.nome_en);
      if (values.pantone) data.append('pantone', values.pantone);
      if (showHex && values.hex_code) data.append('hex_code', values.hex_code);
      if (showTextura && values.textura) data.append('textura', values.textura);

      const url = initial
        ? apiUrl(ApiEndpoints.cor_list) + `${initial.pk}/`
        : apiUrl(ApiEndpoints.cor_list);

      const method = initial ? 'patch' : 'post';

      await api[method](url, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      onSuccess();
      onClose();
      form.reset();
    } catch (err: any) {
      const detail = err?.response?.data;
      if (typeof detail === 'object') {
        const msg = Object.values(detail).flat().join(' ');
        setError(msg);
      } else {
        setError(t`Erro ao salvar cor. Tente novamente.`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text fw={600} size='lg'>
          {initial ? t`Editar Cor` : t`Nova Cor`}
        </Text>
      }
      size='md'
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap='sm'>
          <TextInput
            label={t`Nome - Português`}
            placeholder='ex.: Rosa Chiclete'
            required
            {...form.getInputProps('nome_pt')}
          />
          <TextInput
            label={t`Name - English`}
            placeholder='e.g. Bubblegum Pink'
            required
            {...form.getInputProps('nome_en')}
          />
          <TextInput
            label={t`Pantone`}
            placeholder='ex.: 812 C'
            {...form.getInputProps('pantone')}
          />

          <Radio.Group
            label={t`Como definir a cor?`}
            {...form.getInputProps('color_type')}
          >
            <Group mt='xs' gap='md'>
              <Radio value='hex' label={t`Código Hex`} />
              <Radio value='textura' label={t`Textura`} />
              <Radio value='ambos' label={t`Ambos`} />
            </Group>
          </Radio.Group>

          {showHex && (
            <ColorInput
              label={t`Código Hex`}
              placeholder='#FF5733'
              format='hex'
              required={colorType !== 'textura'}
              {...form.getInputProps('hex_code')}
            />
          )}

          {showTextura && (
            <Box>
              <FileInput
                label={t`Textura`}
                placeholder={t`Selecione uma imagem`}
                accept='image/*'
                leftSection={<IconPhoto size={16} />}
                required={colorType !== 'hex'}
                clearable
                {...form.getInputProps('textura')}
              />
              {initial?.textura_url && !form.values.textura && (
                <Box mt={6}>
                  <Text size='xs' c='dimmed'>{t`Textura atual:`}</Text>
                  <Image
                    src={initial.textura_url}
                    h={60}
                    w='auto'
                    fit='contain'
                    radius='sm'
                    mt={4}
                  />
                </Box>
              )}
            </Box>
          )}

          {error && (
            <Text c='red' size='sm'>{error}</Text>
          )}

          <Group justify='flex-end' mt='md'>
            <Button variant='default' onClick={onClose} disabled={loading}>
              {t`Cancelar`}
            </Button>
            <Button type='submit' loading={loading}>
              {initial ? t`Salvar` : t`Criar Cor`}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}

// ── Página principal ────────────────────────────────────────────────────────

export default function ColorsIndex() {
  const table = useTable('cores');
  const api = useApi();

  const [modalOpen, setModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<CorRecord | null>(null);
  const [modalKey, setModalKey] = useState(0);

  const openCreate = () => {
    setEditRecord(null);
    setModalKey((k) => k + 1);
    setModalOpen(true);
  };

  const openEdit = (record: CorRecord) => {
    setEditRecord(record);
    setModalKey((k) => k + 1);
    setModalOpen(true);
  };

  const handleDelete = useCallback(
    async (record: CorRecord) => {
      if (!window.confirm(t`Deseja excluir a cor "${record.nome_pt}"?`)) return;
      await api.delete(apiUrl(ApiEndpoints.cor_list) + `${record.pk}/`);
      table.refreshTable();
    },
    [api, table]
  );

  const columns: TableColumn[] = useMemo(
    () => [
      {
        accessor: 'nome_pt',
        title: t`Nome (PT)`,
        sortable: true,
        switchable: false,
        copyable: true,
        render: (record: CorRecord) => (
          <Group gap='xs'>
            {record.hex_code && (
              <Box
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 4,
                  background: record.hex_code,
                  border: '1px solid #ccc',
                  flexShrink: 0
                }}
              />
            )}
            {record.textura_url && !record.hex_code && (
              <Image src={record.textura_url} h={18} w={18} radius={4} fit='cover' />
            )}
            <Text>{record.nome_pt}</Text>
          </Group>
        )
      },
      {
        accessor: 'nome_en',
        title: t`Name (EN)`,
        sortable: true,
        copyable: true
      },
      {
        accessor: 'pantone',
        title: t`Pantone`,
        sortable: true,
        copyable: true,
        render: (record: CorRecord) => {
          if (!record.pantone) return null;
          const chipCode = record.pantone.replace(/\s+/g, '-').toLowerCase();
          const chipUrl = `https://www.pantone.com/media/color-finder/img/chips/pantone-color-chip-${chipCode}.webp`;
          return (
            <Group gap='xs'>
              <Image src={chipUrl} h={80} w={80} radius={4} fit='cover' />
              <Text size='sm'>{record.pantone}</Text>
            </Group>
          );
        }
      },
      {
        accessor: 'hex_code',
        title: t`Código Hex`,
        sortable: true,
        copyable: true,
        render: (record: CorRecord) =>
          record.hex_code ? (
            <Group gap='xs'>
              <Box
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 3,
                  background: record.hex_code,
                  border: '1px solid #ccc'
                }}
              />
              <Text ff='monospace' size='sm'>{record.hex_code}</Text>
            </Group>
          ) : null
      },
      {
        accessor: 'textura',
        title: t`Textura`,
        render: (record: CorRecord) =>
          record.textura_url ? (
            <Tooltip label={t`Ver textura`}>
              <Image src={record.textura_url} h={32} w={32} radius='sm' fit='cover' />
            </Tooltip>
          ) : null
      },
      {
        accessor: 'actions',
        title: '',
        render: (record: CorRecord) => (
          <Group gap={4} justify='flex-end' wrap='nowrap'>
            <ActionIcon
              variant='subtle'
              color='blue'
              size='sm'
              onClick={(e) => { e.stopPropagation(); openEdit(record); }}
            >
              <IconEdit size={14} />
            </ActionIcon>
            <ActionIcon
              variant='subtle'
              color='red'
              size='sm'
              onClick={(e) => { e.stopPropagation(); handleDelete(record); }}
            >
              <IconTrash size={14} />
            </ActionIcon>
          </Group>
        )
      }
    ],
    [handleDelete]
  );

  const tableActions = useMemo(
    () => [
      <AddItemButton
        key='add-cor'
        tooltip={t`Nova Cor`}
        onClick={openCreate}
      />
    ],
    []
  );

  return (
    <>
      <CorModal
        key={modalKey}
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => table.refreshTable()}
        initial={editRecord}
      />

      <Stack gap='xs'>
        <PageDetail
          title={t`Cores`}
          icon={<IconPalette />}
        />
        <InvenTreeTable
          url={apiUrl(ApiEndpoints.cor_list)}
          tableState={table}
          columns={columns}
          props={{
            tableActions,
            enableSearch: true,
            enableDownload: false,
            enableSelection: false,
            modelType: ModelType.cor,
            rowStyle: () => ({ height: 120 })
          }}
        />
      </Stack>
    </>
  );
}
