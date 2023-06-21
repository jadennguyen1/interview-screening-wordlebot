import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import Wordle from "../components/WordleBot";
import { fetchWordleResult } from "../api/api";
import "@testing-library/jest-dom/extend-expect";

jest.mock("../api/api", () => ({
    fetchWordleResult: jest.fn().mockResolvedValue({ word: "SERAI" }),
}));

describe("WordleBot Component", () => {
    beforeEach(() => {
        render(<Wordle />);
    });

    afterEach(() => {
        jest.resetAllMocks();
        cleanup();
    });

    const greenColor = "rgb(23, 232, 86)";

    xtest("renders the letters of first guess", async () => {
        const guesses = await screen.findAllByTestId("cards");
        expect(guesses.length).toBe(5);
        fireEvent.click(guesses[0]);
        const elementColor = window.getComputedStyle(guesses[0]).backgroundColor;
        expect(elementColor).toBe(greenColor || "yellow");
    });

    xtest("renders CircularProgress after clicking submit button", async () => {
        const submitButton = screen.getByTestId("submit");
        fireEvent.click(submitButton);
        await screen.findByTestId("loading");
        expect(screen.getByTestId("loading")).toBeInTheDocument();
    });

    xtest("clicking submit button triggers fetchWordleResult", async () => {
        const submitButton = await screen.findByTestId("submit");
        fireEvent.click(submitButton);
        expect(fetchWordleResult).toHaveBeenCalled();
    });

    xtest("renders win message when all letters are green", async () => {
        const guesses = await screen.findAllByTestId("cards");
        guesses.forEach((guess) => {
            fireEvent.click(guess);
            const elementColor = window.getComputedStyle(guess).backgroundColor;
            expect(elementColor).toBe(greenColor);
        });
        const submitButton = screen.getByTestId("submit");
        fireEvent.click(submitButton);
        await screen.findByText("Yay! All done.");
        expect(screen.getByText("Yay! All done.")).toBeInTheDocument();
    });
});
