import React from 'react';
import {
  render as testingLibraryRender,
  screen,
  fireEvent as tlFireEvent,
} from '@testing-library/react';

// Wrap element to have props.className and parent
const wrapElement = (element: any) => {
  if (!element) return element;
  return {
    props: {
      className: element.className || '',
    },
    click: () => tlFireEvent.click(element),
    // Support parent access
    get parent() {
      return wrapElement(element.parentElement);
    },
    // Pass through other properties
    ...element,
  };
};

// Wrap query result
const wrapQuery = (queryFn: any) => {
  return (...args: any[]) => {
    const result = queryFn(...args);
    if (result) {
      return wrapElement(result);
    }
    return result;
  };
};

export const render = (ui: React.ReactElement) => {
  const result = testingLibraryRender(ui as any);
  return {
    ...result,
    getByTestId: wrapQuery(result.getByTestId),
    getByText: wrapQuery(result.getByText),
    queryByText: wrapQuery(result.queryByText),
  };
};

export const fireEvent = {
  press: (element: any) => {
    if (element && element.click) {
      element.click();
    } else if (element) {
      // Fallback to fireEvent.click
      tlFireEvent.click(element);
    }
  },
};

export default {
  render,
  fireEvent,
};
