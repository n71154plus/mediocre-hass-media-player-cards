// HomeAssistantContext.tsx
import { createContext, h } from "preact";
import { useContext } from "preact/hooks";

// Define the type of the `hass` object. Modify this to match your HomeAssistant object.
interface Hass {
  // Example properties (replace with actual HomeAssistant properties)
  callService: (domain: string, service: string, serviceData: object) => void;
  getStates: () => object;
  // Add other necessary properties here
}

// Create the context with a default value of `null` or `undefined` and `Hass | null` type
const HomeAssistantContext = createContext<Hass | null>(null);

// Create a Provider component that will wrap the app
interface HomeAssistantProviderProps {
  hass: Hass;
  children: preact.ComponentChildren;
}

export const HomeAssistantProvider = ({
  hass,
  children,
}: HomeAssistantProviderProps) => (
  <HomeAssistantContext.Provider value={hass}>
    {children}
  </HomeAssistantContext.Provider>
);

// Custom hook to use the context
export const useHomeAssistant = (): Hass => {
  const hass = useContext(HomeAssistantContext);
  if (!hass) {
    throw new Error(
      "useHomeAssistant must be used within a HomeAssistantProvider"
    );
  }
  return hass;
};
