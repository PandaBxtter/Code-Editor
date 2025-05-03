const express = require('express');
const multer = require('multer');
const unzipper = require('unzipper');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.post('/build-apk', upload.single('project'), async (req, res) => {
  const zipPath = req.file.path;
  const projectDir = path.join(__dirname, 'builds', Date.now().toString());

  fs.mkdirSync(projectDir, { recursive: true });

  fs.createReadStream(zipPath)
    .pipe(unzipper.Extract({ path: projectDir }))
    .on('close', async () => {
      exec(`bash ./scripts/build-android.sh ${projectDir}`, (err, stdout, stderr) => {
        if (err) {
          console.error(stderr);
          return res.status(500).send("Build failed.");
        }

        const apkPath = path.join(projectDir, 'android', 'app', 'build', 'outputs', 'apk', 'release', 'app-release.apk');
        if (fs.existsSync(apkPath)) {
          res.download(apkPath);
        } else {
          res.status(500).send("APK not generated.");
        }
      });
    });
});

app.listen(3000, () => console.log("APK builder backend running on port 3000"));