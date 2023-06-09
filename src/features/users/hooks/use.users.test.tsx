/* eslint-disable testing-library/no-render-in-setup */
/* eslint-disable testing-library/no-unnecessary-act */
import { act, fireEvent, render, screen } from "@testing-library/react";

import { User } from "../models/user";
import { useUsers } from "./use.users";
import { UserApiRepo } from "../services/user.api.repo";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore, Store } from "@reduxjs/toolkit";
import { register, State, userReducer } from "../reducer/users.slice";
import userEvent from "@testing-library/user-event";

jest.mock("../services/user.api.repo");
jest.mock("react-router-dom", () => ({
  ...(jest.requireActual("react-router-dom") as any),
  useNavigate: () => jest.fn().mockImplementation(() => ({})),
}));

let mockRepo: UserApiRepo;
let mockDispatch: jest.Mock;
let initialState: State;

let mockStore: Store;
let mockUser = {
  name: "test",
  email: "test@",
} as unknown as User;
let registerAction = register(mockUser);

describe("Given the useUsers Hook", () => {
  beforeEach(async () => {
    mockRepo = {
      register: jest.fn().mockResolvedValue(mockUser),
      login: jest.fn(),
    } as unknown as UserApiRepo;

    initialState = {
      userLogged: {} as User,
      users: [] as User[],
    } as unknown as State;

    mockStore = configureStore({
      reducer: { users: userReducer },
    });

    mockDispatch = jest.fn().mockResolvedValue({
      name: "test",
      email: "test@",
    });

    const TestComponent = function () {
      const { registerUser, loginUser, logoutUser } = useUsers(mockRepo);

      return (
        <>
          <button onClick={() => registerUser(mockUser)}>register</button>
          <button onClick={() => loginUser(mockUser)}>login</button>
          <button onClick={() => logoutUser()}>logout</button>
        </>
      );
    };

    await act(async () =>
      render(
        <Provider store={mockStore}>
          <MemoryRouter>
            <TestComponent></TestComponent>
          </MemoryRouter>
        </Provider>
      )
    );
  });

  describe("When the TestComponent is rendered", () => {
    test("Then the register button should be in the document", async () => {
      const elements = await screen.findAllByRole("button");
      expect(elements[0]).toBeInTheDocument();
    });
  });

  describe("When the register button is clicked", () => {
    test("Then the registerUser function should be called", async () => {
      const elements = await screen.findAllByRole("button");
      await userEvent.click(elements[0]);
      const state = userReducer(initialState, registerAction);
      mockStore.dispatch = mockDispatch;
      expect(mockRepo.register).toHaveBeenCalled();
      expect(state).toStrictEqual({
        userLogged: { email: "test@", name: "test" },
        users: [{ email: "test@", name: "test" }],
      });
    });
  });

  describe("When the login button is clicked", () => {
    test("Then, the loginUser function should be called", async () => {
      const elements = await screen.findAllByRole("button");
      await fireEvent.click(elements[1]);
      expect(mockRepo.login).toHaveBeenCalled();
    });
  });
  describe("When the logout button is clicked", () => {
    test("Then, the logoutUser function should be called", async () => {
      const elements = await screen.findAllByRole("button");
      await fireEvent.click(elements[2]);
    });
  });
});
