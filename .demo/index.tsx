import ReactDOM from 'react-dom';
import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { IntlProvider } from 'react-intl';
import { StyledEngineProvider } from '@mui/material/styles';

import { ReportHandler } from 'web-vitals';
import { Resource, Hdes, theme, messages } from './core';


const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};



const init = {
  locale: 'en',
  url: "http://localhost:8081/assets",
};

console.log("INIT", init);


const store: Hdes.Store = {
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
            throw new Hdes.StoreError({
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

const NewApp = (
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={theme}>
      <IntlProvider locale={init.locale} messages={messages[init.locale]}>
        <Resource.Editor store={store} theme='dark' />
      </IntlProvider>
    </ThemeProvider>
  </StyledEngineProvider>);


ReactDOM.render(
  NewApp,
  document.getElementById('root')
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

