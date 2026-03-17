import React from 'react';
import {
  render as testingLibraryRender,
  screen,
  fireEvent as tlFireEvent,
  within,
} from '@testing-library/react';

// Wrap element to support props access
const wrapElement = (element: any): any => {
  if (!element) return element;

  // If already wrapped, return as is
  if (element._wrapped) return element;

  // Get className from class attribute or className property
  let className = '';
  if (element.getAttribute) {
    className = element.getAttribute('class') || '';
  } else if (element.className) {
    className = element.className;
  }

  // Get style
  const style = element.style || {};

  // Create wrapped element with props
  const wrapped = {
    ...element,
    _wrapped: true,
    className, // Direct access to className
    props: {
      className,
      style,
      testID: element.getAttribute?.('data-testid'),
    },
    // Support click for fireEvent.press
    click: () => {
      tlFireEvent.click(element);
    },
    // Support children access
    get children() {
      if (element.children) {
        return Array.from(element.children).map((child: any) => wrapElement(child));
      }
      return [];
    },
    // Support parent access
    get parent() {
      return wrapElement(element.parentElement);
    },
  };

  return wrapped;
};

export const render = (ui: React.ReactElement) => {
  const result = testingLibraryRender(ui as any);

  // Create wrapped queries
  const wrappedQueries = {
    container: result.container,
    getByTestId: (id: string) => {
      const el = result.getByTestId(id);
      return wrapElement(el);
    },
    getByText: (text: string) => {
      const el = result.getByText(text);
      return wrapElement(el);
    },
    queryByText: (text: string) => {
      const el = result.queryByText(text);
      return el ? wrapElement(el) : null;
    },
    getAllByTestId: (id: string) => {
      const els = (result as any).getAllByTestId?.(id) || [];
      return els.map((el: any) => wrapElement(el));
    },
  };

  return {
    ...result,
    ...wrappedQueries,
  };
};

export const fireEvent = {
  press: (element: any) => {
    // Try to find the actual clickable element
    if (element) {
      // If element has click method, use it
      if (element.click && typeof element.click === 'function') {
        element.click();
        return;
      }

      // Otherwise find button inside or use the element directly
      const button = element.tagName === 'BUTTON' ? element : element.querySelector?.('button');
      if (button) {
        tlFireEvent.click(button);
      } else {
        tlFireEvent.click(element);
      }
    }
  },
};

export default {
  render,
  fireEvent,
};
