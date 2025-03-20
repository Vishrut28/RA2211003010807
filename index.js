require("dotenv").config();
const express = require("express");
const { fetchNumbers } = require("./Utils/fetchNumbers");
const { calculateAverage } = require("./utils/calculateAverage");

const app = express();
const PORT = process.env.PORT || 9876;
const WINDOW_SIZE = 10;
let numberWindow = [];

// Add the root route ("/") here
app.get("/", (req, res) => {
    res.send("Welcome to the Average Calculator API");
});

// Existing route for fetching numbers
app.get("/numbers/:type", async (req, res) => {
    const type = req.params.type;
    const prevState = [...numberWindow];

    try {
        const newNumbers = await fetchNumbers(type);

        // Add new numbers ensuring uniqueness
        newNumbers.forEach(num => {
            if (!numberWindow.includes(num)) {
                numberWindow.push(num);
            }
        });

        // Ensure window size limit
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

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
