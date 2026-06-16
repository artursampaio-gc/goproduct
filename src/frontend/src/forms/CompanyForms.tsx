import type {
  ApiFormAdjustFilterType,
  ApiFormFieldSet
} from '@lib/types/Forms';
import {
  IconAt,
  IconAnchor,
  IconBuildingBank,
  IconCurrencyDollar,
  IconGlobe,
  IconHash,
  IconLink,
  IconMapPin,
  IconNote,
  IconPackage,
  IconPhone,
  IconUser
} from '@tabler/icons-react';
import { useMemo, useState } from 'react';

/**
 * Field set for SupplierPart instance
 */
export function useSupplierPartFields({
  manufacturerId,
  manufacturerPartId,
  partId
}: {
  manufacturerId?: number;
  manufacturerPartId?: number;
  partId?: number;
}) {
  const [part, setPart] = useState<any>({});

  return useMemo(() => {
    const fields: ApiFormFieldSet = {
      part: {
        value: partId,
        disabled: !!partId,
        filters: {
          part: partId,
          purchaseable: true,
          active: true
        },
        onValueChange: (value: any, record: any) => {
          setPart(record);
        }
      },
      manufacturer_part: {
        value: manufacturerPartId,
        autoFill: true,
        filters: {
          manufacturer: manufacturerId,
          part_detail: true,
          manufacturer_detail: true
        },
        adjustFilters: (adjust: ApiFormAdjustFilterType) => {
          return {
            ...adjust.filters,
            part: adjust.data.part
          };
        },
        addCreateFields: {
          part: {
            value: part?.pk,
            disabled: !!part?.pk
          },
          manufacturer: {},
          MPN: {},
          description: {},
          link: {}
        }
      },
      supplier: {
        filters: {
          active: true,
          is_supplier: true
        },
        addCreateFields: {
          name: {},
          description: {},
          is_supplier: { value: true, hidden: true }
        }
      },
      SKU: {
        icon: <IconHash />
      },
      description: {},
      link: {
        icon: <IconLink />
      },
      note: {
        icon: <IconNote />
      },
      pack_quantity: {},
      packaging: {
        icon: <IconPackage />
      },
      primary: {},
      active: {}
    };

    return fields;
  }, [manufacturerId, manufacturerPartId, partId, part]);
}

export function useManufacturerPartFields() {
  return useMemo(() => {
    const fields: ApiFormFieldSet = {
      part: {},
      manufacturer: {
        filters: {
          active: true,
          is_manufacturer: true
        },
        addCreateFields: {
          name: {},
          description: {},
          is_manufacturer: { value: true, hidden: true }
        }
      },
      MPN: {},
      description: {},
      link: {}
    };

    return fields;
  }, []);
}

/**
 * Field set for editing a company instance
 */
export function companyFields(): ApiFormFieldSet {
  return {
    name: {},
    razao_social: {
      label: 'Razão Social',
      icon: <IconUser />
    },
    contato_nome: {
      label: 'Contato',
      required: true,
      icon: <IconUser />
    },
    email: {
      required: true,
      icon: <IconAt />
    },
    website: {
      icon: <IconGlobe />,
      hidden: true
    },
    incoterm: {
      label: 'Incoterm',
      required: true,
      choices: [
        { value: 'EXW', display_name: 'EXW' },
        { value: 'FOB', display_name: 'FOB' },
        { value: 'FCA', display_name: 'FCA' },
        { value: 'CPT', display_name: 'CPT' },
        { value: 'CIP', display_name: 'CIP' },
        { value: 'DAP', display_name: 'DAP' },
        { value: 'DPU', display_name: 'DPU' },
        { value: 'DDP', display_name: 'DDP' },
        { value: 'FAS', display_name: 'FAS' },
        { value: 'CFR', display_name: 'CFR' },
        { value: 'CIF', display_name: 'CIF' }
      ]
    },
    currency: {
      icon: <IconCurrencyDollar />
    },
    phone: {
      label: 'Telefone',
      icon: <IconPhone />
    },
    tax_id: { hidden: true },
    endereco: {
      label: 'Endereço',
      required: true,
      multiline: true,
      icon: <IconMapPin />
    },
    porto: {
      label: 'Porto',
      required: true,
      icon: <IconAnchor />
    },
    dados_bancarios: {
      label: 'Dados Bancários',
      required: true,
      multiline: true,
      icon: <IconBuildingBank />
    },
    termo_pagamento: {
      label: 'Termo de Pagamento',
      required: true,
      multiline: true,
      icon: <IconCurrencyDollar />
    },
    is_supplier: {},
    is_manufacturer: {},
    is_customer: {},
    active: {}
  };
}
