import { Button, Stack, Text, Group, ThemeIcon } from '@mantine/core';
import { IconFileDescription, IconPackage } from '@tabler/icons-react';
import { StylishText } from '@lib/components/StylishText';
import type { DashboardWidgetProps } from '../DashboardWidget';

export function CreateOrderDocWidget(): DashboardWidgetProps {
  return {
    label: 'create-order-doc',
    title: 'Criar Documentação de Novo Pedido',
    description: 'Atalho rápido para gerar a documentação de um novo pedido de compra/venda',
    minHeight: 2,
    minWidth: 3,
    render: () => (
      <Stack justify="space-between" h="100%" p="xs">
        <Stack gap="xs">
          <Group gap="xs">
            <ThemeIcon color="blue" size="lg" radius="md">
              <IconFileDescription size={20} />
            </ThemeIcon>
            <StylishText size="md">Novo Pedido</StylishText>
          </Group>
          <Text size="sm" c="dimmed">
            Gere a documentação necessária para um novo pedido: PO, Carton Marks, Barcodes, Inner Labels e HangTags automaticamente.
          </Text>
        </Stack>
        <Button variant="light" color="blue" fullWidth disabled>
          Criar Documentação (Em breve)
        </Button>
      </Stack>
    )
  };
}

export function RegisterProductWidget(): DashboardWidgetProps {
  return {
    label: 'register-product',
    title: 'Cadastrar Novo Produto',
    description: 'Atalho rápido para registrar uma nova peça ou parte no catálogo',
    minHeight: 2,
    minWidth: 3,
    render: () => (
      <Stack justify="space-between" h="100%" p="xs">
        <Stack gap="xs">
          <Group gap="xs">
            <ThemeIcon color="teal" size="lg" radius="md">
              <IconPackage size={20} />
            </ThemeIcon>
            <StylishText size="md">Cadastrar Produto</StylishText>
          </Group>
          <Text size="sm" c="dimmed">
            Adicione um novo produto, defina sua categoria, subcategoria e modelo, parâmetros técnicos e outras informações.
          </Text>
        </Stack>
        <Button variant="light" color="teal" fullWidth disabled>
          Cadastrar Produto (Em breve)
        </Button>
      </Stack>
    )
  };
}
