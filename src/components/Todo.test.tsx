// src/components/Todo.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TodoApp from './Todo';

beforeEach(() => {
  localStorage.clear();
});

test('renders TodoApp and adds a new task', () => {
  render(<TodoApp />);
  const input = screen.getByPlaceholderText(/add a new task/i);
  const addButton = screen.getByText(/add/i);

  fireEvent.change(input, { target: { value: 'Test task' } });
  fireEvent.click(addButton);

  const task = screen.getByText(/test task/i);
  expect(task).toBeInTheDocument();
});

test('toggles task completion', () => {
  render(<TodoApp />);
  const input = screen.getByPlaceholderText(/add a new task/i);
  const addButton = screen.getByText(/add/i);

  fireEvent.change(input, { target: { value: 'Test task' } });
  fireEvent.click(addButton);

  const checkbox = screen.getByRole('checkbox');
  fireEvent.click(checkbox);

  const task = screen.getByText(/test task/i);
  expect(task).toHaveStyle('text-decoration: line-through');

  // Toggle back to incomplete
  fireEvent.click(checkbox);
  expect(task).not.toHaveStyle('text-decoration: line-through');
});

test('filters tasks', () => {
  render(<TodoApp />);
  const input = screen.getByPlaceholderText(/add a new task/i);
  const addButton = screen.getByText(/add/i);

  // Add active task
  fireEvent.change(input, { target: { value: 'Active task' } });
  fireEvent.click(addButton);

  // Add completed task
  fireEvent.change(input, { target: { value: 'Completed task' } });
  fireEvent.click(addButton);
  const checkboxes = screen.getAllByRole('checkbox');
  fireEvent.click(checkboxes[1]); // Mark the second task as completed

  // Test Active Filter
  const activeButton = screen.getByText(/active/i);
  fireEvent.click(activeButton);

  const activeTask = screen.getByText(/active task/i);
  expect(activeTask).toBeInTheDocument();
  expect(screen.queryByText(/completed task/i)).toBeNull();

  // Test Completed Filter
  const completedButton = screen.getByText(/completed/i);
  fireEvent.click(completedButton);

  const completedTask = screen.getByText(/completed task/i);
  expect(completedTask).toBeInTheDocument();
  expect(screen.queryByText(/active task/i)).toBeNull();

  // Test All Filter
  const allButton = screen.getByText(/all/i);
  fireEvent.click(allButton);

  expect(screen.getByText(/active task/i)).toBeInTheDocument();
  expect(screen.getByText(/completed task/i)).toBeInTheDocument();
});

test('persists todos across renders', () => {
  render(<TodoApp />);
  const input = screen.getByPlaceholderText(/add a new task/i);
  const addButton = screen.getByText(/add/i);

  fireEvent.change(input, { target: { value: 'Persistent task' } });
  fireEvent.click(addButton);

  // Rerender the component
  render(<TodoApp />);
  const task = screen.getByText(/persistent task/i);
  expect(task).toBeInTheDocument();
});
