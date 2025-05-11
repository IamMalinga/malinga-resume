import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  // Test the heading
  test('renders portfolio heading', () => {
    render(<App />);
    const headingElement = screen.getByText(/Malinga's Portfolio under construction/i);
    expect(headingElement).toBeInTheDocument();
  });

  // Test the counter button and its functionality
  test('renders counter button and increments count', () => {
    render(<App />);
    const buttonElement = screen.getByRole('button', { name: /count is 0/i });
    expect(buttonElement).toBeInTheDocument();

    // Simulate a click to increment the count
    fireEvent.click(buttonElement);
    expect(screen.getByRole('button', { name: /count is 1/i })).toBeInTheDocument();
  });

  // Test the "learn more" paragraph
  test('renders learn more text', () => {
    render(<App />);
    const paragraphElement = screen.getByText(/Click on the Vite and React logos to learn more/i);
    expect(paragraphElement).toBeInTheDocument();
  });

  // Test the presence of Vite and React logos
  test('renders Vite and React logos', () => {
    render(<App />);
    const viteLogo = screen.getByAltText(/Vite logo/i);
    const reactLogo = screen.getByAltText(/React logo/i);
    expect(viteLogo).toBeInTheDocument();
    expect(reactLogo).toBeInTheDocument();
  });
});