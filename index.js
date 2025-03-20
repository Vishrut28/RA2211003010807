require("dotenv").config();
const express = require("express");
const { fetchNumbers } = require("./Utils/fetchNumbers");
const { calculateAverage } = require("./utils/calculateAverage").default;

const app = express();
const PORT = process.env.PORT || 9876;
const WINDOW_SIZE = 10;
let numberWindow = [];

app.get("/", (req, res) => {
    res.send("Welcome to the Average Calculator API");
});

app.get("/numbers/:type", async (req, res) => {
    const type = req.params.type;
    const prevState = [...numberWindow];

    try {
        const newNumbers = await fetchNumbers(type);

        newNumbers.forEach(num => {
            if (!numberWindow.includes(num)) {
                numberWindow.push(num);
            }
        });

        if (numberWindow.length > WINDOW_SIZE) {
            numberWindow = numberWindow.slice(-WINDOW_SIZE);
        }

        const avg = calculateAverage(numberWindow);

        return res.json({
            windowPrevState: prevState,
            windowCurrState: numberWindow,
            numbers: newNumbers,
            avg: avg.toFixed(2)
        });
    } catch (error) {
        return res.status(500).json({ error: "Failed to fetch numbers" });
    }
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
