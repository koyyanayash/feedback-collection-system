const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Feedback = require("./models/feedback");

const app = express();
const port = 3008;

mongoose
  .connect("mongodb://localhost:27017/feedback_system")
  .then(() => console.log("Connected to MongoDB successfully!"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("views"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/submit-feedback", async (req, res) => {
  const feedbackData = new Feedback({
    name: req.body.name,
    contactNumber: req.body.contactNumber,
    email: req.body.email,
    feedback: req.body.feedback,
  });

  console.log("Feedback data:", feedbackData);

  try {
    await feedbackData.save();
    res.send(`
      <html>
      <head>
        <title>Feedback Collection System</title>
      </head>
      <body>
        <h1>Thank You</h1>
        <p>Your feedback has been successfully submitted.</p>
        <a href='/'>Go back to form</a>
      </body>
      </html>
    `);
  } catch (err) {
    console.error("Error saving feedback:", err);
    res.status(500).send("There was an error in submitting your feedback.");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
