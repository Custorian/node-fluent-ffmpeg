// The solution based on adding -movflags for mp4 output
// For more movflags details check ffmpeg docs
// https://ffmpeg.org/ffmpeg-formats.html#toc-Options-9

var fs = require('fs');
var path = require('path');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

var pathToSourceFile = path.resolve(__dirname, '../test/assets/testvideo-169.avi');
var readStream = fs.createReadStream(pathToSourceFile);
var writeStream = fs.createWriteStream('./output.mp4');

ffmpeg(readStream)
    .on('progress', function(progress) {
        console.log('Processing: ' + progress.percent + '% done @ ' + progress.currentFps + ' fps');
    })
    .on('end', function(err, stdout, stderr) {
        console.log('Finished processing', err, stdout, stderr);
    })
    .on('error', function(err, stdout, stderr) {
        console.log(err.message); //this will likely return "code=1" not really useful
        console.log("stdout:\n" + stdout);
        console.log("stderr:\n" + stderr); //this will contain more detailed debugging info
    })
  .addOutputOptions('-movflags +frag_keyframe+separate_moof+omit_tfhd_offset+empty_moov')
  .format('mp4')
  .pipe(writeStream);
