import { Container, CircularProgress, Box } from "@mui/material";
import Layout from "./components/Layout";
import Header from "./components/Header";
import Wordle from "./components/WordleBot";
import { useEffect, useState } from "react";

function App() {
    const [isLoading, setisLoading] = useState(true);
    useEffect(() => {
        setTimeout(() => {
            setisLoading(false);
        }, 1000);
    }, [isLoading]);
    return (
        <Layout>
            <Container maxWidth="sm">
                <Header />
                {isLoading ? (
                    <Box
                        display={"flex"}
                        justifyContent={"center"}
                        alignItems={"center"}
                        marginTop={"3rem"}
                    >
                        <CircularProgress size={70} />
                    </Box>
                ) : (
                    <Wordle />
                )}
            </Container>
        </Layout>
    );
}

export default App;
