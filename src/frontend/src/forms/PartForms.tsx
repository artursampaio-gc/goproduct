import type { ApiFormFieldSet } from '@lib/types/Forms';
import { t } from '@lingui/core/macro';
import { IconBuildingStore, IconCopy, IconPackages } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import { useGlobalSettingsState } from '../states/SettingsStates';

/**
 * Construct a set of fields for creating / editing a Part instance
 */
export function usePartFields({
  create = false,
  partId,
  duplicatePartInstance
}: {
  partId?: number;
  duplicatePartInstance?: any;
  create?: boolean;
}): ApiFormFieldSet {
  const globalSettings = useGlobalSettingsState();

  const [virtual, setVirtual] = useState<boolean | undefined>(undefined);
  const [purchaseable, setPurchaseable] = useState<boolean | undefined>(
    undefined
  );

  return useMemo(() => {
    const fields: ApiFormFieldSet = {
      category: {
        label: t`Modelo`,
        description: t`Selecione o Modelo ao qual este produto pertence`,
        required: true,
        filters: {
          structural: false,
          level: 2
        }
      },
      name: {
        label: t`Nome - Português`,
        description: t`Nome do produto em português`,
        required: true
      },
      name_en: {
        required: true
      },
      IPN: {
        label: t`SKU`,
        description: t`Código interno`,
        required: true
      },
      description: {
        label: t`Especificação`,
        description: t`Descreva o produto (essa é a descrição que aparece na PO)`,
        required: true,
        multiline: true
      },
      material_corpo: {
        required: true
      },
      material_forro: {},
      cor: {
        required: true
      },
      peso: {
        suffix: ' g',
        thousandSeparator: '.',
        decimalSeparator: ',',
        decimalScale: 2
      },
      fob: {
        prefix: '$ ',
        thousandSeparator: ',',
        decimalSeparator: '.',
        decimalScale: 2,
        fixedDecimalScale: true
      },
      codigo_barras: {
        required: true
      },
      revision: {
        description: t`Revisão/Versão do Produto`
      },
      revision_of: {
        hidden: true,
        filters: {
          is_template: false,
          assembly: globalSettings.isSet('PART_REVISION_ASSEMBLY_ONLY')
            ? true
            : undefined
        }
      },
      variant_of: {
        hidden: true,
        filters: {
          is_template: true
        }
      },
      keywords: {
        hidden: true
      },
      units: {},
      link: {
        label: t`Link Dropbox`
      },
      default_location: {
        hidden: true,
        filters: {
          structural: false
        }
      },
      default_expiry: {},
      minimum_stock: {
        hidden: true
      },
      maximum_stock: {
        hidden: true
      },
      responsible: {
        filters: {
          is_active: true
        }
      },
      component: {
        default: globalSettings.isSet('PART_COMPONENT')
      },
      assembly: {
        default: globalSettings.isSet('PART_ASSEMBLY')
      },
      is_template: {
        default: globalSettings.isSet('PART_TEMPLATE')
      },
      testable: {
        default: false
      },
      trackable: {
        default: globalSettings.isSet('PART_TRACKABLE')
      },
      purchaseable: {
        value: purchaseable,
        default: globalSettings.isSet('PART_PURCHASEABLE'),
        onValueChange: (value: boolean) => {
          setPurchaseable(value);
        }
      },
      salable: {
        default: globalSettings.isSet('PART_SALABLE')
      },
      virtual: {
        default: globalSettings.isSet('PART_VIRTUAL'),
        value: virtual,
        onValueChange: (value: boolean) => {
          setVirtual(value);
        }
      },
      locked: {},
      active: {},
      starred: {
        field_type: 'boolean',
        label: t`Subscribed`,
        description: t`Subscribe to notifications for this part`,
        disabled: false,
        required: false
      }
    };

    // Additional fields for creation
    if (create && !virtual) {
      fields.copy_category_parameters = {};

      if (virtual != false) {
        fields.initial_stock = {
          icon: <IconPackages />,
          children: {
            quantity: {
              value: 0
            },
            location: {}
          }
        };
      }

      if (purchaseable) {
        fields.initial_supplier = {
          icon: <IconBuildingStore />,
          children: {
            supplier: {
              filters: {
                is_supplier: true
              }
            },
            sku: {},
            manufacturer: {
              filters: {
                is_manufacturer: true
              }
            },
            mpn: {}
          }
        };
      }
    }

    // Additional fields for part duplication
    if (create && duplicatePartInstance?.pk) {
      fields.duplicate = {
        icon: <IconCopy />,
        children: {
          part: {
            value: duplicatePartInstance?.pk,
            hidden: true
          },
          copy_image: {
            value: true
          },
          copy_bom: {
            value: globalSettings.isSet('PART_COPY_BOM'),
            hidden: !duplicatePartInstance?.assembly
          },
          copy_notes: {
            value: true
          },
          copy_parameters: {
            value: globalSettings.isSet('PART_COPY_PARAMETERS')
          },
          copy_tests: {
            value: true,
            hidden: !duplicatePartInstance?.testable
          }
        }
      };
    }

    if (globalSettings.isSet('PART_REVISION_ASSEMBLY_ONLY')) {
      fields.revision_of.filters['assembly'] = true;
    }

    // Pop 'revision' field if PART_ENABLE_REVISION is False
    if (!globalSettings.isSet('PART_ENABLE_REVISION')) {
      delete fields['revision'];
      delete fields['revision_of'];
    }

    // Pop 'expiry' field if expiry not enabled
    if (!globalSettings.isSet('STOCK_ENABLE_EXPIRY')) {
      delete fields['default_expiry'];
    }

    // Remove "locked" field if locking not enabled
    if (!globalSettings.isSet('PART_ENABLE_LOCKING')) {
      delete fields['locked'];
    }

    if (create) {
      delete fields['starred'];

      // Pre-fill the units field with the default value on creation
      fields.units.value = 'pcs';
    }

    return fields;
  }, [
    partId,
    virtual,
    purchaseable,
    create,
    globalSettings,
    duplicatePartInstance
  ]);
}

/**
 * Construct a set of fields for creating / editing a PartCategory instance
 */
export function partCategoryFields({
  create
}: {
  create?: boolean;
}): ApiFormFieldSet {
  const fields: ApiFormFieldSet = useMemo(() => {
    const fields: ApiFormFieldSet = {
      parent: {
        // Locked to the context: the parent is set from where creation started,
        // which keeps the tree at exactly Categoria > Sub-Categoria > Modelo.
        hidden: true
      },
      name: {},
      description: {},
      default_location: {
        filters: {
          structural: false
        }
      },
      default_keywords: {},
      starred: {
        field_type: 'boolean',
        label: t`Subscribed`,
        description: t`Subscribe to notifications for this category`,
        disabled: false,
        required: false
      },
      icon: {
        field_type: 'icon'
      }
    };

    if (create) {
      delete fields['starred'];
    }

    return fields;
  }, [create]);

  return fields;
}

export function partStocktakeFields(): ApiFormFieldSet {
  return {
    part: {
      hidden: true
    },
    quantity: {},
    item_count: {},
    cost_min: {},
    cost_min_currency: {},
    cost_max: {},
    cost_max_currency: {}
  };
}
