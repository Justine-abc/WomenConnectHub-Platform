import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

// Additional tests for WomenConnect Hub
test('renders WomenConnect Hub title', () => {
  render(<App />);
  const titleElement = screen.getByText(/WomenConnect Hub/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders navigation menu', () => {
  render(<App />);
  const navElement = screen.getByRole('navigation');
  expect(navElement).toBeInTheDocument();
});

test('renders main content area', () => {
  render(<App />);
  const mainElement = screen.getByRole('main');
  expect(mainElement).toBeInTheDocument();
});