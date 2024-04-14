require("dotenv").config();

const multer = require("multer");
const express = require("express");
const userRoutes = require("./routes/userRoutes");
const { client, run } = require("./connect");
const { MongoClient, ObjectId } = require("mongodb");
const registrationController = require("./controllers/registrationController");

const Property = require("./models/propertyModel");

const app = express();
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../frontend/img"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
  fileFilter: function (req, file, cb) {
    // Accept only jpg and png files
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Only JPG and PNG files are allowed"));
    }
    cb(null, true);
  },
});

const upload = multer({ storage: storage });
app.use(express.static(path.join(__dirname, "../frontend")));

app.use(express.json());
app.use("/api", userRoutes); // Mount the userRoutes on the /api path

// API ENDPOINT TO HANDLE REGISTRATION
app.post("/register", async (req, res) => {
  const formData = req.body;
  try {
    const db = client.db("CollabSpacedb");
    const collection = db.collection("Register");
    const result = await collection.insertOne(formData);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to register user", error });
  }
});

// login
app.post("/login", registrationController.loginUser);
// API ENDPOINT TO ADD A NEW PROPERTY
app.post("/add-property", async (req, res) => {
  // const propertyData = req.body; // Get property data from request body
  const propertyData = { ...req.body, createdAt: new Date() };
  try {
    const db = client.db("CollabSpacedb");
    const collection = db.collection("Properties");
    const result = await collection.insertOne(propertyData);
    res.status(201).json({ message: "Property added successfully", result });
  } catch (error) {
    res.status(500).json({ message: "Failed to add property", error });
  }
});

// API ENDPOINT TO LOAD ALL PROPERTIES IN THE PROPERTY TABLE
app.get("/properties", async (req, res) => {
  try {
    const db = client.db("CollabSpacedb");
    const collection = db.collection("Properties");
    const properties = await collection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch properties", error });
  }
});

// API ENDPOINT THAT FETCHES A SINGLE PROPERTY BY _ID
app.get("/properties/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const db = client.db("CollabSpacedb");
    const collection = db.collection("Properties");
    const property = await collection.findOne({
      _id: new ObjectId(id),
    });

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.status(200).json(property);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch property", error });
  }
});

// API ENDPOINT TO UPDATE THE PROPERTY TABLE
app.put("/properties/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const db = client.db("CollabSpacedb");
    const collection = db.collection("Properties");
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.status(200).json({ message: "Property updated successfully", result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update property", error });
  }
});

// API ENDPOINT TO DELETE A PROPERTY
app.delete("/properties/:id", async (req, res) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(400).send("Invalid ID format");
  }

  try {
    const _id = new ObjectId(id);
    const db = client.db("CollabSpacedb");
    const collection = db.collection("Properties");
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete property", error });
  }
});

// API ENDPOINT TO ADD A NEW WORKSPACE WITH IMAGE
app.post("/add-workspace", upload.single("image"), async (req, res) => {
  const workspaceData = req.body; // Get workspace data from request body
  const imageFile = req.file; // Get uploaded image file

  try {
    if (!imageFile) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const workspaceWithImage = {
      ...workspaceData,
      imageURL: `/img/${imageFile.filename}`, // Relative path to the uploaded image
    };

    // Access the database and collection
    const db = client.db("CollabSpacedb");
    const collection = db.collection("Workspaces");

    // Insert the new workspace into the database
    const result = await collection.insertOne(workspaceWithImage);

    // Send response with the inserted workspace data
    res
      .status(201)
      .json({ message: "Workspace added successfully", data: result.ops[0] });
  } catch (error) {
    // If an error occurs, log it and send an error response
    console.error(error);
    res.status(500).json({ message: "Failed to add workspace", error });
  }
});

function isValidObjectId(id) {
  return ObjectId.isValid(id);
}

// API ENDPOINT TO FETCH ALL WORKSPACES FOR A PROPERTY
app.get("/properties/:propertyId/workspaces", async (req, res) => {
  const propertyId = req.params.propertyId;
  try {
    const db = client.db("CollabSpacedb");
    const collection = db.collection("Workspaces");
    const workspaces = await collection.find({ propertyId }).toArray();
    res.status(200).json(workspaces);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch workspaces", error });
  }
});

// API ENDPOINT THAT FETCHES A SINGLE WORKSPACE BY _ID
app.get("/workspaces/:id", async (req, res) => {
  const id = req.params.id;

  if (!isValidObjectId(id)) {
    return res.status(400).send("Invalid ID format");
  }

  try {
    const db = client.db("CollabSpacedb");
    const collection = db.collection("Workspaces");
    // Convert the provided ID string to a MongoDB ObjectId
    const ObjectId = require("mongodb").ObjectId;
    const objectId = new ObjectId(id);

    // Retrieve the workspace by ID
    const workspace = await collection.findOne({ _id: objectId });

    // Check if workspace exists
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    res.status(200).json(workspace);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch workspace", error });
  }
});

// API ENDPOINT TO UPDATE A WORKSPACE
app.put("/workspaces/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const db = client.db("CollabSpacedb");
    const collection = db.collection("Workspaces");
    const workspaces = await collection.find({}).toArray();

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    res.status(200).json({ message: "Workspace updated successfully", result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update workspace", error });
  }
});

// API ENDPOINT TO DELETE A WORKSPACE
app.delete("/workspaces/:id", async (req, res) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(400).send("Invalid ID format");
  }

  try {
    const _id = new ObjectId(id);
    const db = client.db("CollabSpacedb");
    const collection = db.collection("Workspaces");
    const result = await collection.deleteOne({ _id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    res.status(200).json({ message: "Workspace deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete workspace", error });
  }
});

// API ENDPOINT TO LOAD ALL WORKSPACES
app.get("/workspaces", async (req, res) => {
  try {
    const db = client.db("CollabSpacedb");
    const collection = db.collection("Workspaces");
    const workspaces = await collection.find({}).toArray(); // Removed the empty object
    res.status(200).json(workspaces);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch workspaces", error });
  }
});

// API to get workspaces based on propertyId
app.get("/workspaces/:propertyId", async (req, res) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("Workspaces");
    const workspaces = await collection
      .find({ propertyId: parseInt(req.params.propertyId) })
      .toArray();
    res.status(200).json(workspaces);
  } catch (e) {
    res.status(500).json({ message: e.message });
  } finally {
    await client.close();
  }
});

// API ENDPOINT FOR SEARCH
app.get("/search-properties", async (req, res) => {
  try {
    let propertiesQuery = {};

    if (req.query.address)
      propertiesQuery.address = { $regex: req.query.address, $options: "i" };

    if (req.query.neighborhood) {
      propertiesQuery.neighborhood = req.query.neighborhood;
    }

    if (req.query.squarefeet) {
      propertiesQuery.squarefeet = { $gte: req.query.squarefeet };
    }

    if (req.query.parking) {
      propertiesQuery.parking = req.query.parking;
    }

    if (req.query["publictranspo"]) {
      propertiesQuery.publicTranspo = req.query["publictranspo"];
    }

    const db = client.db("CollabSpacedb");
    let workspaceQuery = {};

    if (req.query.capacity) {
      workspaceQuery.capacity = { $gte: req.query.capacity };
    }

    if (req.query.smoking) {
      workspaceQuery.smoking = req.query.smoking;
    }

    if (req.query.available) {
      workspaceQuery.available = req.query.available;
    }

    if (req.query.term) {
      workspaceQuery.term = req.query.term;
    }

    if (req.query.price) {
      workspaceQuery.price = { $gte: req.query.price };
    }

    let matchingPropertyIds = [];

    // If workspace-specific criteria are specified, find matching workspaces first
    if (Object.keys(workspaceQuery).length > 0) {
      const matchingWorkspaces = await db
        .collection("Workspaces")
        .find(workspaceQuery)
        .toArray();
      matchingPropertyIds = matchingWorkspaces.map((ws) => ws.propertyId);
      // Adjust the properties query to only include properties with matching workspaces
      propertiesQuery._id = {
        $in: matchingPropertyIds.map((id) => new ObjectId(id)),
      };
    }

    // Fetch matching properties based on updated query
    const matchingProperties = await db
      .collection("Properties")
      .find(propertiesQuery)
      .toArray();

    res.json(matchingProperties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error searching properties" });
  }
});

// API ENDPOINT TO FETCH ALL WORKSPACES FOR A PROPERTY
app.get("/api/properties/:propertyId/workspaces", async (req, res) => {
  const { propertyId } = req.params;
  let query = { propertyId: propertyId }; // Start with propertyId as the base query

  // Additional filters based on query parameters
  if (req.query.capacity) {
    query.capacity = { $gte: req.query.capacity };
  }
  if (req.query.smoking) {
    query.smoking = req.query.smoking;
  }
  if (req.query.available) {
    query.available = new Date(req.query.available); // Ensure date format matches what's stored in DB
  }
  if (req.query.term) {
    query.term = req.query.term;
  }
  if (req.query.price) {
    query.price = { $gte: req.query.price };
  }
  try {
    const db = client.db("CollabSpacedb");
    const collection = db.collection("Workspaces");
    const workspaces = await collection.find(query).toArray();
    if (workspaces.length === 0) {
      return res.status(404).json({
        message:
          "No workspaces found for this property with specified criteria",
      });
    }
    res.status(200).json(workspaces);
  } catch (error) {
    console.error("Failed to fetch workspaces:", error);
    res.status(500).json({ message: "Error fetching workspaces" });
  }
});

const PORT = process.env.PORT || 3000;

// Use the run function from connection.js to connect to MongoDB
run()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(console.dir);
