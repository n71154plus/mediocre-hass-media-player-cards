import { HomeAssistant } from "custom-card-helpers"
import { createContext } from "preact"
import { StyleSheetManager } from "styled-components"

export type CardContextType<T> = {
    rootElement: HTMLElement
    hass: HomeAssistant
    config: T
}

export const CardContext = createContext<CardContextType<any>>({
    rootElement: null,
    hass: null,
    config: null,
})

export const CardContextProvider = ({ rootElement, hass, config, children }) => {
    return (
        <StyleSheetManager target={rootElement}>
            <CardContext.Provider value={{ rootElement, hass, config }}>
                {children}
            </CardContext.Provider>
        </StyleSheetManager>
    )
}