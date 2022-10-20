import { render, screen } from '@testing-library/react';
import App from './App';

test('total car maker', ()=>{
  render(<App />);
  const makerNumber = screen.getByText(/10430/i);
  expect(makerNumber).toBeInTheDocument();
})


