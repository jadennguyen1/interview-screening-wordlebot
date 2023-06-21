import { Card, CardContent, Grid } from "@mui/material";
import { motion } from "framer-motion";
import { DataItem } from "./WordleBot";

interface GuessProps {
    guess: DataItem;
    handleBoxClick: (idx: number, word: string) => void;
}

const Guess: React.FC<GuessProps> = ({ guess, handleBoxClick }) => {
    const { word, letters, pointer } = guess;

    return (
        <Grid
            item
            role="words"
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            sx={{ display: "flex", gap: "5px", marginBottom: "7px" }}
        >
            {word.split("").map((letter, idx) => (
                <Card
                    data-testid="cards"
                    key={idx}
                    component={motion.div}
                    whileTap={{ scale: 0.9 }}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "50px",
                        width: "50px",
                        border: "1px solid #000",
                        boxShadow: "2px 2px 2px black",
                        fontSize: "1.5rem",
                        fontWeight: "600",
                        backgroundColor:
                            letters[idx] === "x"
                                ? "white"
                                : letters[idx] === "g"
                                ? "#17e856"
                                : letters[idx] === "y"
                                ? "yellow"
                                : "",
                        transition: pointer === "auto" ? "background-color 0.1s ease-in-out" : "",
                        pointerEvents: pointer === "none" ? "none" : "auto",
                        cursor: pointer === "none" ? "none" : "pointer",
                    }}
                    onClick={() => handleBoxClick(idx, word)}
                >
                    <CardContent>{letter}</CardContent>
                </Card>
            ))}
        </Grid>
    );
};

export default Guess;
