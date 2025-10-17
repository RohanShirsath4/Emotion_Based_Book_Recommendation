// Ensures required face-api.js models exist in public/models and match the installed version
// Preferred: copy from node_modules/face-api.js/weights (same version as dependency)
// Fallback: download from jsDelivr for the installed version

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import https from "https";

import { createRequire } from "module";
const require = createRequire(import.meta.url);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const modelsDir = path.resolve(__dirname, "..", "public", "models");
const packageJson = require("../package.json");
const faceApiVersion = (packageJson.dependencies && packageJson.dependencies["face-api.js"]) || "latest";
const normalizedVersion = faceApiVersion.replace(/^[^\d]*/, "");
const cdnBase = `https://cdn.jsdelivr.net/npm/face-api.js@${normalizedVersion || "latest"}/weights`;
const githubWeightsBase = "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights";

const fileNames = [
  "tiny_face_detector_model-weights_manifest.json",
  "tiny_face_detector_model-shard1",
  "face_expression_model-weights_manifest.json",
  "face_expression_model-shard1",
  // ssd mobilenet v1 (more robust)
  "ssd_mobilenetv1_model-weights_manifest.json",
  "ssd_mobilenetv1_model-shard1",
  "ssd_mobilenetv1_model-shard2",
  // face landmark 68 (required for withFaceLandmarks)
  "face_landmark_68_model-weights_manifest.json",
  "face_landmark_68_model-shard1",
];

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function copyIfExists(src, dest) {
  return new Promise((resolve, reject) => {
    const rd = fs.createReadStream(src);
    rd.on("error", reject);
    const wr = fs.createWriteStream(dest);
    wr.on("error", reject);
    wr.on("close", resolve);
    rd.pipe(wr);
  });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https
      .get(url, (response) => {
        if (response.statusCode && response.statusCode >= 400) {
          return reject(
            new Error(`Failed to download ${url} (status ${response.statusCode})`)
          );
        }
        response.pipe(file);
        file.on("finish", () => file.close(() => resolve(dest)));
      })
      .on("error", (err) => {
        fs.unlink(dest, () => reject(err));
      });
  });
}

async function main() {
  ensureDir(modelsDir);
  // Try to copy from node_modules first
  const weightsDir = path.resolve(__dirname, "..", "node_modules", "face-api.js", "weights");
  let copied = false;
  if (fs.existsSync(weightsDir)) {
    try {
      for (const name of fileNames) {
        const src = path.join(weightsDir, name);
        const dest = path.join(modelsDir, name);
        if (fs.existsSync(src)) {
          // eslint-disable-next-line no-console
          console.log(`Copying ${name} from node_modules...`);
          await copyIfExists(src, dest);
          copied = true;
        }
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn("Copy from node_modules failed, will try CDN:", e.message);
    }
  }

  // If copy didn’t succeed for all files, fetch missing from GitHub RAW first, then CDN
  for (const name of fileNames) {
    const target = path.join(modelsDir, name);
    if (fs.existsSync(target)) continue;
    const githubUrl = `${githubWeightsBase}/${name}`;
    const cdnUrl = `${cdnBase}/${name}`;
    try {
      // eslint-disable-next-line no-console
      console.log(`Downloading ${name} from GitHub...`);
      await downloadFile(githubUrl, target);
      continue;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(`GitHub download failed for ${name}, trying CDN... (${e.message})`);
    }
    // eslint-disable-next-line no-console
    console.log(`Downloading ${name} from CDN...`);
    await downloadFile(cdnUrl, target);
  }
  // Integrity check: ensure files exist and are not empty
  const missingOrEmpty = [];
  for (const name of fileNames) {
    const target = path.join(modelsDir, name);
    if (!fs.existsSync(target)) {
      missingOrEmpty.push(`${name} (missing)`);
      continue;
    }
    const stat = fs.statSync(target);
    if (!stat.size) missingOrEmpty.push(`${name} (empty)`);
  }
  if (missingOrEmpty.length) {
    // eslint-disable-next-line no-console
    console.warn("Model integrity issues:", missingOrEmpty.join(", "));
  }
  // eslint-disable-next-line no-console
  console.log("Models ready in public/models");
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});


