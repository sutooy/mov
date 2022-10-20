import { render, screen } from '@testing-library/react';
import App from './App';

test('total car maker', ()=>{
  render(<App />);
  const makerNumber = screen.getByText(/10430/i);
  expect(makerNumber).toBeInTheDocument();
});
test('filter text', ()=>{
  render(<App />);
  const textFilter = screen.getByText(/Filter/i);
  expect(textFilter).toBeInTheDocument();
})
test('Bar', () => {
  render(<App />);
  const Bar = screen.getByTestId('Bar');
});


