const axios = require("axios");
const fs = require("fs");
const path = require("path");
const AdmZip = require("adm-zip");
const pLimit = require("p-limit");

const linksFilePath = "links.txt";
const downloadDir = "downloaded_html";
const zipFilePath = "final_pages.zip";
const errorLogPath = path.join(downloadDir, "error_log.txt");

if (fs.existsSync(downloadDir)) {
    fs.rmdirSync(downloadDir, { recursive: true });
}
fs.mkdirSync(downloadDir);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isValidUrl = (urlString) => {
    try {
        new URL(urlString);
        return true;
    } catch {
        return false;
    }
};

const getUniqueFileName = (outputDir, fileName) => {
    let uniqueName = fileName;
    let counter = 1;
    while (fs.existsSync(path.join(outputDir, uniqueName))) {
        const ext = path.extname(fileName);
        const base = path.basename(fileName, ext);
        uniqueName = `${base}_${counter}${ext}`;
        counter++;
    }
    return uniqueName;
};

const readLinks = (filePath) => {
    try {
        const data = fs.readFileSync(filePath, "utf-8");
        return data.split(/\r?\n/).filter((line) => line.trim() !== "" && isValidUrl(line.trim()));
    } catch (error) {
        console.error(`Failed to read links file: ${error.message}`);
        return [];
    }
};

const downloadHtml = async (link, outputDir) => {
    try {
        const response = await axios.get(link, { timeout: 15000 });
        const urlPath = new URL(link).pathname || "index";
        const fileName = getUniqueFileName(outputDir, urlPath.endsWith(".html") ? 
            path.basename(urlPath) : `${path.basename(urlPath)}.html`);
        const filePath = path.join(outputDir, fileName);

        fs.writeFileSync(filePath, response.data, "utf-8");
        console.log(`Downloaded: ${link} -> ${filePath}`);
        return filePath;
    } catch (error) {
        console.error(`Failed to download ${link}: ${error.message}`);
        fs.appendFileSync(errorLogPath, `Failed to download ${link}: ${error.message}\n`);
        throw error;
    }
};

const downloadHtmlWithRetry = async (link, outputDir, retries = 3) => {
    let attempt = 0;
    while (attempt < retries) {
        try {
            return await downloadHtml(link, outputDir);
        } catch (error) {
            if (error.response && error.response.status === 429) {
                const retryAfter = error.response.headers['retry-after'];
                const delay = retryAfter ? parseInt(retryAfter, 10) * 1000 : Math.pow(2, attempt) * 1000;
                console.log(`Rate limited. Retrying in ${delay / 1000} seconds...`);
                await sleep(delay);
            } else {
                throw error;
            }
        }
        attempt++;
    }
    console.error(`Failed after ${retries} retries: ${link}`);
    fs.appendFileSync(errorLogPath, `Failed after ${retries} retries: ${link}\n`);
    return null;
};

const createZip = async (outputDir, zipFilePath) => {
    try {
        const zip = new AdmZip();
        const files = fs.readdirSync(outputDir).filter((file) => file !== "error_log.txt");

        files.forEach((file) => {
            zip.addLocalFile(path.join(outputDir, file));
        });

        zip.writeZip(zipFilePath);
        console.log(`Created ZIP: ${zipFilePath}`);
    } catch (error) {
        console.error(`Failed to create ZIP: ${error.message}`);
    }
};

(async function main() {
    try {
        const links = readLinks(linksFilePath);

        if (links.length === 0) {
            console.log("No valid links found in the file.");
            return;
        }

        const limit = pLimit(3); // Reduce concurrency to 3
        const downloadPromises = links.map((link) =>
            limit(() => downloadHtmlWithRetry(link, downloadDir))
        );
        await Promise.all(downloadPromises);

        await createZip(downloadDir, zipFilePath);
        console.log("All tasks completed!");
    } catch (error) {
        console.error(`An error occurred: ${error.message}`);
    }
})();