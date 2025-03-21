import { HomeAssistant } from "custom-card-helpers";
import { useCallback, useEffect, useMemo, useRef } from "preact/hooks";
import { ActionConfig } from "custom-card-helpers";
import { HaFormSchema } from "../../types";

export type ActionConfiguratorProps = {
  hass: HomeAssistant;
  value: ActionConfig | undefined;
  onChange: (value?: ActionConfig) => void;
  label?: string;
  disabled?: boolean;
};

export const ActionConfigurator = ({
  hass,
  value,
  onChange,
  label = "Action",
  disabled = false,
}: ActionConfiguratorProps) => {
  const formRef = useRef<HTMLElement | null>(null);

  // Create base schema with action type selector
  const schema = useMemo<HaFormSchema>(() => {
    // Base schema with action type selector
    const baseSchema: HaFormSchema = [
      {
        name: "action",
        label: label,
        selector: {
          select: {
            options: [
              { value: "none", label: "None" },
              { value: "more-info", label: "More Info" },
              { value: "toggle", label: "Toggle" },
              { value: "call-service", label: "Call Service" },
              { value: "navigate", label: "Navigate" },
              { value: "url", label: "URL" },
              { value: "assist", label: "Assist" },
            ],
            mode: "dropdown",
          },
        },
      },
    ];

    // Add fields based on action type
    switch (value?.action) {
      case "more-info":
        baseSchema.push({
          name: "entity",
          label: "Entity ID",
          selector: {
            entity: {},
          },
        });
        break;
      case "call-service":
        baseSchema.push(
          {
            name: "service",
            label: "Service",
            selector: {
              text: {},
            },
          },
          {
            name: "service_data",
            label: "Service Data (JSON)",
            selector: {
              object: {},
            },
          }
        );
        break;
      case "navigate":
        baseSchema.push({
          name: "navigation_path",
          label: "Navigation Path",
          selector: {
            text: {},
          },
        });
        break;
      case "url":
        baseSchema.push({
          name: "url_path",
          label: "URL",
          selector: {
            text: {},
          },
        });
        break;
    }

    // Add confirmation if enabled
    if (value?.confirmation) {
      baseSchema.push({
        name: "confirmation_text",
        label: "Confirmation Text",
        selector: {
          text: {},
        },
      });
    }

    return baseSchema;
  }, [value?.action, value?.confirmation, label]);

  // Transform ActionConfig to data format for ha-form
  const data = useMemo(() => {
    if (!value) {
      return { action: "none" };
    }
    const result: Record<string, any> = { ...value };

    return result;
  }, [value]);

  // Handle form changes
  const handleValueChanged = useCallback(
    (e: Event) => {
      const customEvent = e as CustomEvent;
      const newData = customEvent.detail.value;

      // Transform form data back to ActionConfig
      let actionConfig: ActionConfig | undefined;

      if (newData.action === "none") {
        actionConfig = { action: "none" };
      } else {
        if (newData.action !== value?.action) {
          actionConfig = { action: newData.action };
        } else {
          actionConfig = { ...newData } as ActionConfig;
        }
      }

      onChange(actionConfig);
    },
    [onChange, value?.action]
  );

  // Set up event listeners
  useEffect(() => {
    const formElement = formRef.current;

    if (formElement) {
      formElement.addEventListener("value-changed", handleValueChanged);
    }

    return () => {
      if (formElement) {
        formElement.removeEventListener("value-changed", handleValueChanged);
      }
    };
  }, [formRef.current, handleValueChanged]);

  // Generate a unique key based on action type and confirmation presence
  const formKey = `${value?.action || "none"}-${
    value?.confirmation ? "confirm" : "no-confirm"
  }`;

  return (
    <ha-form
      key={formKey}
      ref={formRef as any}
      hass={hass}
      data={data}
      schema={schema}
      computeLabel={(item) => item.label || item.name}
      disabled={disabled}
    />
  );
};
