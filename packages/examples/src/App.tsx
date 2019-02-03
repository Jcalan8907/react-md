import React, { useState, Fragment, useEffect, FunctionComponent } from "react";
import cn from "classnames";
import { Button, buttonThemeClassNames } from "@react-md/button";
import { TextContainer, Text } from "@react-md/typography";
import { StatesConfig, withStates } from "@react-md/states";
import { KeyboardTracker, useIsKeyboardFocused } from "@react-md/wia-aria";
import { useEventListener } from "@react-md/utils";
import { Portal } from "@react-md/portal";

import styles from "./menu.module.scss";
import { MenuButton, Menu, MenuItem } from "./components/menus";

const LinkButton: FunctionComponent<any> = withStates(
  ({ children, ...themeProps }) => {
    const { theme, themeType, buttonType, ...props } = themeProps;
    return (
      <a {...props} className={buttonThemeClassNames(themeProps)}>
        {children}
      </a>
    );
  }
);

export interface IAppSize {
  [key: string]: boolean;
  isPhone: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isPortraitPhone: boolean;
  isLandscapePhone: boolean;
  isPortraitTablet: boolean;
  isLandscapeTablet: boolean;
  isDesktopPhone: boolean;
  isDesktopTablet: boolean;
}

function getCurrentAppSize(): IAppSize {
  const tabletMinWidth = 768;
  const desktopMinWidth = 1025;
  const phoneMedia = `screen and (max-width: ${tabletMinWidth - 1}px)`;
  // tslint:disable-next-line:max-line-length
  const tabletMedia = `screen and (min-width: ${tabletMinWidth}px) and (max-width: ${desktopMinWidth - 1}px)`; // prettier-ignore
  const desktopMedia = `screen and (min-width: ${desktopMinWidth}px)`;

  const matchesTablet = window.matchMedia(tabletMedia).matches;

  const portrait = window.innerHeight > window.innerWidth;
  const isDesktop = window.matchMedia(desktopMedia).matches;
  const isTablet = !isDesktop && matchesTablet;
  const isPhone = !isDesktop && !isTablet;
  const isPortraitPhone = isPhone && portrait;
  const isLandscapePhone = isPhone && !portrait;
  const isPortraitTablet = isTablet && portrait;
  const isLandscapeTablet = isTablet && !portrait;
  const isDesktopPhone = isDesktop && window.matchMedia(phoneMedia).matches;
  const isDesktopTablet = isDesktop && matchesTablet;
  return {
    isPhone,
    isTablet,
    isDesktop,
    isPortraitPhone,
    isLandscapePhone,
    isPortraitTablet,
    isLandscapeTablet,
    isDesktopPhone,
    isDesktopTablet,
  };
}

function updateAppSize(oldSize: IAppSize, setSize: (size: IAppSize) => void) {
  const nextSize = getCurrentAppSize();
  if (Object.keys(oldSize).some(key => oldSize[key] !== nextSize[key])) {
    setSize(nextSize);
  }
}

const App = () => {
  const [
    { visible, isVisibleByKeyboard, defaultFocusFirst },
    setVisible,
  ] = useState({
    visible: false,
    isVisibleByKeyboard: false,
    defaultFocusFirst: true,
  });
  const [appSize, setSize] = useState<IAppSize>(getCurrentAppSize());
  useEventListener("resize", () => setSize(getCurrentAppSize()));

  return (
    <StatesConfig preventColorPollution>
      <KeyboardTracker>
        <TextContainer>
          <Text type="headline-4">App</Text>
          <form name="example-form" onSubmit={event => event.preventDefault()}>
            <label htmlFor="input-1">Text input</label>
            <input id="input-1" type="text" />

            <Button id="example-form-submit" theme="primary" type="submit">
              Submit
            </Button>
          </form>
          <MenuButton
            id="menu-button-1"
            menuId="menu-1"
            onRequestShow={(defaultFocusFirst, isVisibleByKeyboard) =>
              setVisible({
                visible: true,
                isVisibleByKeyboard,
                defaultFocusFirst,
              })
            }
            visible={visible}
            theme="primary"
            themeType="contained"
          >
            Hello, world!
          </MenuButton>
          {visible && (
            <Menu
              id="menu-1"
              isVisibleByKeyboard={isVisibleByKeyboard}
              defaultFocusFirst={defaultFocusFirst}
              onRequestHide={() =>
                setVisible({
                  visible: false,
                  isVisibleByKeyboard: false,
                  defaultFocusFirst: true,
                })
              }
            >
              {Array.from(new Array(10)).map((_, i) => (
                <MenuItem
                  id={`item-${i + 1}`}
                  key={i}
                  onClick={() => console.log(`Clicked item ${i + 1}`)}
                >
                  {`Item ${i + 1}`}
                </MenuItem>
              ))}
            </Menu>
          )}
          <Button id="yolo" themeType="contained" theme="secondary">
            Yolo
          </Button>
          <Button id="yolo-2" themeType="contained" theme="secondary" disabled>
            Yolo
          </Button>
          <Button id="hello-2">Hello, World!</Button>
          <Text
            type="body-1"
            component="section"
            style={{ marginTop: "20rem" }}
          >
            <pre>{JSON.stringify(appSize, null, 2)}</pre>
          </Text>
        </TextContainer>
        <Portal visible>
          <Text type="headline-1">Hello, world!</Text>
        </Portal>
        <LinkButton id="link-1" href="#" themeType="contained">
          Link button
        </LinkButton>
      </KeyboardTracker>
    </StatesConfig>
  );
};

export default App;