const express = require('express');
const db = require('./db'); 
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));  
app.use(express.urlencoded({ extended: true }));

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (req.body.mediaType === 'video') {
            cb(null, 'public/videos'); 
        } else {
            cb(null, 'public/images'); 
        }
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// 🏠 Render Homepage
app.get('/', (req, res) => {
    db.all('SELECT * FROM tblContentTable', [], (err, events) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error fetching events");
        }
        db.all('SELECT * FROM tblSettings', [], (err, media) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Error fetching background media");
            }
            res.render('index', { events: events, media: media || [] });
        });
    });
});

// 🛠 Render Admin Page
app.get('/admin', (req, res) => {
    res.render('admin'); 
});
app.get('/get-downloads', (req, res) => {
    db.all('SELECT * FROM tblDownloads ORDER BY downloadTime DESC', [], (err, users) => {
        if (err) {
            console.error("❌ Database error:", err.message);
            return res.status(500).json({ success: false, error: "Database error: " + err.message });
        }
        res.json({ success: true, users });
    });
});
app.post('/upload/media', upload.single('mediaFile'), (req, res) => {
    console.log("📂 Upload request received");

    if (!req.file) {
        console.error("❌ No file uploaded.");
        return res.status(400).json({ success: false, error: "No file uploaded." });
    }

    const mediaUrl = req.file.filename;
    const mediaType = req.body.mediaType;

    if (!mediaType) {
        console.error("❌ Media type missing.");
        return res.status(400).json({ success: false, error: "Media type is required." });
    }

    db.run('INSERT INTO tblSettings (mediaUrl, mediaType) VALUES (?, ?)', 
        [mediaUrl, mediaType], 
        (err) => {
            if (err) {
                console.error("❌ Database error:", err.message);
                return res.status(500).json({ success: false, error: "Database error: " + err.message });
            }
            console.log("✅ Media uploaded successfully!");
            res.json({ success: true, message: "Media uploaded successfully!" });
        }
    );
});


// ✅ Add express.json() to parse JSON request body
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// 🛠 Update Event
app.post('/update/event/:id', upload.single('eventImage'), (req, res) => {
    console.log("Received request to update event with ID:", req.params.id);
    console.log("Request body:", req.body);
    console.log("Uploaded file:", req.file); // Debugging file upload

    const { title, description, link, existingImage } = req.body;
    const imageUrl = req.file ? req.file.filename : existingImage; // Keep old image if no new image is uploaded

    if (!title || !description) {
        console.error("❌ Validation failed: Missing title or description");
        return res.status(400).json({ success: false, error: "Title and Description are required." });
    }

    db.run('UPDATE tblContentTable SET title = ?, description = ?, imageUrl = ?, link = ? WHERE id = ?', 
        [title, description, imageUrl, link, req.params.id], 
        function(err) {
            if (err) {
                console.error("❌ Database error:", err.message);
                return res.status(500).json({ success: false, error: "Database error: " + err.message });
            }
            if (this.changes === 0) {
                console.error("❌ No rows updated. Check if the event ID exists.");
                return res.status(404).json({ success: false, error: "Event not found." });
            }
            console.log("✅ Event updated successfully!");
            res.json({ success: true });
        }
    );
});
app.post('/upload/event', upload.single('eventImage'), (req, res) => {
    const { title, description, link } = req.body;
    const imageUrl = req.file ? req.file.filename : null;

    // Validation: Title and Description are required
    if (!title || !description) {
        return res.status(400).json({ success: false, error: "Title and Description are required." });
    }

    // Insert into database
    db.run(
        'INSERT INTO tblContentTable (title, description, imageUrl, link) VALUES (?, ?, ?, ?)', 
        [title, description, imageUrl, link], 
        function(err) {
            if (err) {
                console.error("❌ Database error:", err.message);
                return res.status(500).json({ success: false, error: "Database error: " + err.message });
            }
            console.log("✅ Event added successfully!");
            res.json({ success: true });
        }
    );
});

app.get('/events', (req, res) => {
    db.all('SELECT * FROM tblContentTable', [], (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Database error" });
        } else {
            res.json(rows);
        }
    });
});

app.get('/latest-media', (req, res) => {
    db.get('SELECT * FROM tblSettings ORDER BY id DESC LIMIT 1', [], (err, row) => {
        if (err) {
            console.error("Database error:", err.message);
            return res.status(500).json({ error: "Database error: " + err.message });
        }
        if (row) {
            res.json({ mediaUrl: row.mediaUrl, mediaType: row.mediaType });
        } else {
            res.json({ mediaUrl: null, mediaType: null });
        }
    });
});

app.post('/clear/events', (req, res) => {
    db.run('DELETE FROM tblContentTable', (err) => {
        if (err) {
            return res.json({ success: false, error: err.message });
        }
        res.json({ success: true });
    });
});


app.post('/clear/media', (req, res) => {
    db.run('DELETE FROM tblSettings', (err) => {
        if (err) {
            return res.json({ success: false, error: err.message });
        }
        res.json({ success: true });
    });
});

// app.get("/mobility", (req, res) => {
//     res.render("mobility"); //
// })
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/:page", (req, res) => {
    const page = req.params.page.toLowerCase();
    const allowedPages = ["mobility", "about", "integration", "data-migrations", "analytics",
        "businessprocesstransformation","technologyimplementation","cloudmigration","managedservices"
        ,"changemanagement","designthinking","alml","dataanalyticsvisualization","digitalskilltraining",
    "celonis","microsoft","servicenow","sap","salesforce","feedback","casestudy","about","hospitality","utilities"
,"notforprofit","manufacturing","consumercpg","banking"];

    if (page === "index") {
        db.all("SELECT * FROM tblContentTable", [], (err, events) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Error fetching events");
            }
            db.all("SELECT * FROM tblSettings", [], (err, media) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send("Error fetching background media");
                }
                res.render("index", { events: events, media: media || [] });
            });
        });
    } else if (allowedPages.includes(page)) {
        res.render(page);
    } else {
        res.status(404).render("404");
    }
});

app.post('/save-download', (req, res) => {
    const { name, email } = req.body;
    const downloadTime = new Date().toISOString();

    if (!name || !email) {
        return res.status(400).json({ success: false, error: "Name and email are required." });
    }

    db.run('INSERT INTO tblDownloads (name, email, downloadTime) VALUES (?, ?, ?)', 
        [name, email, downloadTime], 
        (err) => {
            if (err) {
                console.error("❌ Database error:", err.message);
                return res.status(500).json({ success: false, error: "Database error: " + err.message });
            }
            console.log("✅ Download details saved successfully!");
            res.json({ success: true, message: "Download details saved successfully!" });
        }
    );
});




app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT} 🚀`));
