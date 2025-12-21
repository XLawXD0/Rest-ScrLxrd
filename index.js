const connectDB = require("./src/config/database");
const express = require('express');
const chalk = require('chalk');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

app.enable("trust proxy");
app.set("json spaces", 2);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

connectDB();

app.use('/', express.static(path.join(__dirname, 'api-page')));
app.use('/src', express.static(path.join(__dirname, 'src')));

// ================= SETTINGS =================
const settingsPath = path.join(__dirname, './src/settings.json');
const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));

// ================= RESPONSE FORMATTER =================
app.use((req, res, next) => {
    const originalJson = res.json;

    res.json = function (data) {
        // hanya format response API (object + ada status)
        if (data && typeof data === 'object' && data.status !== undefined) {
            return originalJson.call(this, {
                status: data.status,
                creator: settings.apiSettings.creator || "Created Using Rynn UI",
                ...(data.result !== undefined ? { result: data.result } : {}),
                ...(data.error !== undefined ? { error: data.error } : {})
            });
        }

        // selain API (HTML, file, dll)
        return originalJson.call(this, data);
    };

    next();
});

// ================= API ROUTE LOADER =================
let totalRoutes = 0;
const apiFolder = path.join(__dirname, './src/api');

fs.readdirSync(apiFolder).forEach((subfolder) => {
    const subfolderPath = path.join(apiFolder, subfolder);

    if (fs.statSync(subfolderPath).isDirectory()) {
        fs.readdirSync(subfolderPath).forEach((file) => {
            if (path.extname(file) === '.js') {
                require(path.join(subfolderPath, file))(app);
                totalRoutes++;

                console.log(
                    chalk.bgHex('#FFFF99').hex('#333').bold(
                        ` Loaded Route: ${subfolder}/${file} `
                    )
                );
            }
        });
    }
});

console.log(chalk.bgHex('#90EE90').hex('#333').bold(' Load Complete! ✓ '));
console.log(
    chalk.bgHex('#90EE90').hex('#333').bold(
        ` Total Routes Loaded: ${totalRoutes} `
    )
);

// ================= PAGES =================
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'api-page', 'index.html'));
});

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'api-page', '404.html'));
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).sendFile(path.join(__dirname, 'api-page', '500.html'));
});

// ================= SERVER =================
app.listen(PORT, () => {
    console.log(
        chalk.bgHex('#90EE90').hex('#333').bold(
            ` Server is running on port ${PORT} `
        )
    );
});

module.exports = app;

