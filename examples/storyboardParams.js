var fs = require('fs');
var path = require('path');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.constan
var pathToSourceFile = path.resolve(__dirname, '../test/assets/bubbletea.mp4');
var writeStream = fs.createWriteStream('./output.mp4');


// read as a stream will not work with MOV containers (mp4)
ffmpeg(pathToSourceFile)
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
    .addOutputOptions('-movflags +frag_keyframe+empty_moov')
    .addOptions(["-crf 35", "-x264-params scenecut=0:open_gop=0:min-keyint=72:keyint=72:ref=4", "-preset slow", "-profile:v main","-level:v 3.1"])
    .videoCodec('libx264')
    .videoBitrate(1024)
    // .withVideoFilter('scale=2:720')
     .withVideoFilter('scale=h=1280:w=720')
    .audioCodec('aac')
    .audioBitrate('128k')
    .format('mp4')
    .fps(30)
    .pipe(writeStream);