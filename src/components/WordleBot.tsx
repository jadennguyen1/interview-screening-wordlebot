import { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Container, Grid, Typography } from "@mui/material";
import Guess from "./Guesses";
import data from "../words.json";
import { fetchWordleResult } from "../api/api";
import "../App.css";

const MAX_GUESSES = 6;

export interface DataItem {
    word: string;
    letters: string[];
    pointer: string;
}

const Wordle: React.FC = () => {
    const [index, setIndex] = useState<number>(0);
    const [isLoading, setisLoading] = useState<boolean>(false);
    const [guesses, setGuesses] = useState<DataItem[]>([
        { word: "", letters: ["", "", "", "", ""], pointer: "auto" },
    ]);
    const [remainingGuesses, setRemainingGuesses] = useState<number>(MAX_GUESSES);
    const [isWin, setIsWin] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        resetGame();
    }, []);

    const resetGame = (): void => {
        setIsWin(false);
        setError("");
        setRemainingGuesses(MAX_GUESSES);
        setIndex(0);
        const firstWord = generateFirstGuess();
        setGuesses([
            {
                word: firstWord,
                letters: ["x", "x", "x", "x", "x"],
                pointer: "auto",
            },
        ]);
    };

    const fetchSuggestion = (): void => {
        updateRecentGuess();
        const word = guesses[guesses.length - 1].word;
        const clue = guesses[guesses.length - 1].letters.join("");
        const requestBody = [{ word, clue }];
        const recentGuess = guesses[guesses.length - 1].letters;
        setRemainingGuesses((prevRemainingGuesses) => prevRemainingGuesses - 1);

        if (checkWin(recentGuess)) return;

        if (!isWin && remainingGuesses > 1) {
            setisLoading(true);
            fetchWordleResult(requestBody)
                .then((res) => {
                    const newWord = res.guess.toUpperCase();
                    const newItem = {
                        word: newWord,
                        letters: ["x", "x", "x", "x", "x"],
                        pointer: "auto",
                    };
                    setGuesses((prevGuesses) => [
                        ...prevGuesses.map((guess) => ({ ...guess, pointer: "none" })),
                        newItem,
                    ]);
                })
                .catch((error) => {
                    if (typeof error === "object" && error instanceof Error) {
                        setError(error.message);
                    } else {
                        setError("An error occurred.");
                    }
                    console.error(error);
                })
                .finally(() => {
                    setIndex((prevIndex) => prevIndex + 1);
                    setisLoading(false);
                });
        }
    };

    const handleBoxClick = (colorIdx: number, word: string): void => {
        setGuesses((prevGuesses) =>
            prevGuesses.map((item) => {
                if (item.word === word) {
                    const newColors = JSON.parse(JSON.stringify(item.letters));
                    const currentColor = newColors[colorIdx];

                    if (currentColor === "x") {
                        newColors[colorIdx] = "g";
                    } else if (currentColor === "g") {
                        newColors[colorIdx] = "y";
                    } else {
                        newColors[colorIdx] = "x";
                    }

                    return { ...item, letters: newColors };
                }

                return item;
            })
        );
    };

    const checkWin = (recentGuess: string[]): boolean => {
        if (recentGuess.every((color) => color === "g")) {
            setIsWin(true);
            return true;
        }
        return false;
    };

    const updateRecentGuess = (): void => {
        setGuesses((prevGuesses) => {
            const updatedGuesses = [...prevGuesses];
            if (updatedGuesses.length > 0) {
                updatedGuesses[updatedGuesses.length - 1].pointer = "none";
            }
            return updatedGuesses;
        });
    };

    const generateFirstGuess = (): string => {
        const randomIndex = Math.floor(Math.random() * data.length);
        return data[randomIndex].toUpperCase();
    };

    return (
        <Container
            className="container"
            sx={{ display: "flex", flexDirection: "column", marginTop: "2rem", gap: "2rem" }}
        >
            <Typography variant="h4" gutterBottom align="center">
                Word to guess: {error ? "An error has occurred." : isWin ? "" : guesses[index].word}
            </Typography>
            <Grid data-testid="grid" container direction="column" alignItems="center">
                {guesses.map((word, index) => (
                    <Guess handleBoxClick={handleBoxClick} guess={word} key={index} />
                ))}
            </Grid>
            {isWin && (
                <Typography variant="h6" align="center">
                    Yay! All done.
                </Typography>
            )}
            {!isWin && remainingGuesses === 0 && (
                <Typography variant="h6" align="center">
                    Game over!
                </Typography>
            )}
            {!isWin && remainingGuesses > 0 && (
                <Typography variant="h6" align="center">
                    Remaining guesses: {error === "" ? remainingGuesses : "An error as occurred."}
                </Typography>
            )}
            <Box display="flex" justifyContent="center" alignItems="center">
                {!isWin && remainingGuesses > 0 && error === "" ? (
                    <Button
                        data-testid="submit"
                        variant="contained"
                        disabled={isWin || remainingGuesses === 0 || isLoading || error !== ""}
                        onClick={fetchSuggestion}
                    >
                        {isLoading ? (
                            <CircularProgress data-testid="loading" color="secondary" size={23} />
                        ) : (
                            <Typography letterSpacing={2}>Submit</Typography>
                        )}
                    </Button>
                ) : (
                    <Button variant="contained" onClick={resetGame}>
                        <Typography letterSpacing={2}>Reset</Typography>
                    </Button>
                )}
            </Box>
            <Typography color={"red"} align="center">
                {error}
            </Typography>
        </Container>
    );
};

export default Wordle;
