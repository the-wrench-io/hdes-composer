import React from 'react';
import ReactDOM from 'react-dom';
import { IntlProvider } from 'react-intl';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { SnackbarProvider } from 'notistack';
import Burger, { siteTheme } from '@the-wrench-io/react-burger';
import Client, { messages, Main, Secondary, Toolbar, Composer } from './core';


const init = {
  locale: 'en',
  url: "http://localhost:8081/assets", //spring-app
};

console.log("INIT", init);

const store: Client.Store = {
  fetch<T>(path: string, req?: RequestInit): Promise<T> {
    if (!path) {
      throw new Error("can't fetch with undefined url")
    }

    const defRef: RequestInit = {
      method: "GET",
      credentials: 'same-origin',
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      }
    };

    const url = init.url;
    const finalInit: RequestInit = Object.assign(defRef, req ? req : {});
    return fetch(url + path, finalInit)
      .then(response => {
        if (response.status === 302) {
          return null;
        }
        if (!response.ok) {
          return response.json().then(data => {
            console.error(data);
            throw new Client.StoreError({
              text: response.statusText,
              status: response.status,
              errors: data
            });
          });
        }
        return response.json();
      })
  }
};

const CreateApps: React.FC<{}> = () => {
  // eslint-disable-next-line 
  const backend = React.useMemo(() => new Client.ServiceImpl(store), [store]);
  const wrenchComposer: Burger.App<Composer.ContextType> = {
    id: "wrench-composer",
    components: { primary: Main, secondary: Secondary, toolbar: Toolbar },
    state: [
      (children: React.ReactNode, restorePoint?: Burger.AppState<Composer.ContextType>) => (<>{children}</>),
      () => ({})
    ]
  };

  return (
    <Composer.Provider service={backend}>
      <Burger.Provider children={[wrenchComposer]} secondary="toolbar.assets" drawerOpen/>
    </Composer.Provider>
  )
}

const NewApp = (
  <IntlProvider locale={init.locale} messages={messages[init.locale]}>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={siteTheme}>
        <SnackbarProvider>
          <CreateApps />
        </SnackbarProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  </IntlProvider>);


ReactDOM.render(
  NewApp,
  document.getElementById('root')
);