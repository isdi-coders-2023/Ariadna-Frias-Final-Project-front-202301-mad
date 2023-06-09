/* eslint-disable testing-library/no-render-in-setup */
/* eslint-disable testing-library/no-unnecessary-act */
import { configureStore } from "@reduxjs/toolkit";
import { act, render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { Festival } from "../models/festival";
import * as ac from "../reducer/festivals.actions.creator";
import { festivalReducer } from "../reducer/festivals.reducer";
import { FestivalApiRepo } from "../services/repository/festival.repo";
import { useFestivals } from "./use.festivals";
jest.mock("../services/firebase/firebase-user");

describe("Given the useFestivals hook", () => {
  const mockFestival = {
    id: "3",
    name: "BBK",
    img: "png",
  } as unknown as Festival;
  let initialState = [
    { id: "3", name: "BBK", img: "png" } as unknown as Festival,
  ];
  const action = ac.addCreator(mockFestival);
  const updateAction = ac.updateCreator(mockFestival);
  let elements: HTMLElement[];

  const mockStore = configureStore({
    reducer: { festivals: festivalReducer },
    preloadedState: {
      festivals: [],
    },
  });

  const mockFile = new File(["image"], "test.jpeg");

  const mockRepo: FestivalApiRepo = {
    url: "testing",
    loadFestivals: jest.fn(),
    loadByMusic: jest.fn(),
    loadOneFestival: jest.fn(),
    createFestival: jest.fn(),
    updateFestival: jest.fn(),
    deleteFestival: jest.fn(),
  } as unknown as FestivalApiRepo;
  beforeEach(async () => {
    const TestComponent = function () {
      const {
        loadFestivals,
        loadByMusic,
        loadOneFestival,
        addFestival,
        updateFestival,
        deleteFestival,
      } = useFestivals(mockRepo);
      return (
        <div>
          <button onClick={() => loadFestivals()}></button>
          <button onClick={() => loadByMusic("")}></button>
          <button onClick={() => loadOneFestival("1")}></button>
          <button
            title="addbutton"
            onClick={() => addFestival(mockFestival, mockFile)}
          ></button>
          <button
            title="edit"
            onClick={() => updateFestival(mockFestival, mockFile, "image")}
          ></button>
          <button
            title="delete"
            onClick={() => deleteFestival(mockFestival.id)}
          ></button>
        </div>
      );
    };

    await act(async () => {
      render(
        <>
          <Provider store={mockStore}>
            <MemoryRouter>
              <TestComponent></TestComponent>
            </MemoryRouter>
          </Provider>
        </>
      );
    });
    elements = await screen.findAllByRole("button");
  });
  describe("When the TestComponent is rendered", () => {
    test("We should find a button in the document", async () => {
      const element = await screen.findAllByRole("button");
      expect(element[0]).toBeInTheDocument();
    });
  });

  describe("When loadFestivals is called", () => {
    test("Then it should call the repo method loadFestivals", async () => {
      const loadFestivals = await fireEvent.click(elements[0]);
      expect(mockRepo.loadFestivals).toHaveBeenCalled();
      expect(loadFestivals).toEqual(true);
    });
  });
  describe("When loadByMusic is called", () => {
    test("Then it should call the repo method loadByMusic", async () => {
      const loadByMusic = await fireEvent.click(elements[1]);
      expect(mockRepo.loadByMusic).toHaveBeenCalled();
      expect(loadByMusic).toEqual(true);
    });
  });
  describe("When loadOneFestival is called", () => {
    test("Then it should call the repo method loadOneFestival", async () => {
      const loadOneFestival = await fireEvent.click(elements[2]);
      expect(mockRepo.loadOneFestival).toHaveBeenCalled();
      expect(loadOneFestival).toEqual(true);
    });
  });
  describe("When createFestival is called", () => {
    test("Then it should create a new festival", async () => {
      await fireEvent.click(elements[3]);
      expect(mockRepo.createFestival).toHaveBeenCalled();
      const state = festivalReducer(initialState, action);
      expect(state).toContainEqual(action.payload);
    });
  });
  describe("When updateFestival is called", () => {
    test("Then it should edit the selected festival", async () => {
      await fireEvent.click(elements[4]);
      expect(mockRepo.updateFestival).toHaveBeenCalled();
      const state = festivalReducer(initialState, updateAction);
      expect(state).toContainEqual(action.payload);
    });
  });
  describe("When deleteFestival is called", () => {
    test("Then it should call the delete the festival", async () => {
      await fireEvent.click(elements[5]);
      expect(mockRepo.deleteFestival).toHaveBeenCalled();
    });
  });
});
