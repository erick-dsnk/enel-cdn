import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

const app = express();
const port = process.env.PORT || 3000;

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    let fileExt = file.mimetype.split("/")[1];

    cb(null, `${uuidv4()}.${fileExt}`);
  },
});

let upload = multer({ storage });

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", express.static("uploads"));

app.post("/upload", upload.single("image"), (req, res, next) => {
  const imageDetails = `\tFilename: ${req.file?.filename}\n\tOriginal Filename: ${req.file?.originalname}\n\tSize: ${req.file?.size}\n\tMimeType: ${req.file?.mimetype}`;
  console.log("  A file has been uploaded to the server:\n");
  console.log(imageDetails);
  res
    .status(200)
    .send({
      filename: `${req.protocol}://${req.hostname}${
        req.hostname == "localhost" ? ":" + port : ""
      }/${req.file?.filename}`,
    });
});

app.listen(port, () => console.log(`Server listening on port ${port}.`));
