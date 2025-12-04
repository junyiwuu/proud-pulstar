---
title: FFmpeg
---





`-i`: is input, can input multiple (`ffmpeg -i video.mov -i audio.wav -c:v libx264 -c:a aac output.mp4`)

Check media info: `ffmpeg -i input.mov`
Convert video format: `ffmpeg -i input.mov output.mp4`
Re-encode with specific codec `ffmpeg -i input.mov -c:v libx264 -c:a aac output.mp4`
- `-c:v libx264` : use H.264 encoder for video
- `-c:a aac`: use aac for audio
Just copy without re-encoding: `ffmpeg -i input.mov -c copy output.mov`


**Burn a watermark**
`ffmpeg -i input.mp4 -i watermark.png -filter_complex "overlay=10:10" output.mp4`
First is video input, second is watermark image
`overlay=10:10` : place watermark 10 pixels from left, 10 pixels from top

Do bottom-right watermark:
`ffmpeg -i input.mp4 -i watermark.png -filter_complex "overlay=main_w-overlay_w-10:main_h-overlay_h-10" output.mp4`


Text watermark: 
`ffmpeg -i input.mp4 -vf "drawtext=text='CONFIDENTIAL':fontsize=40:x=10:y=10" output.mp4`

The watermark change every frame:
`ffmpeg -i input.mp4 -vf "drawtext=text='CONFIDENTIAL':fontcolor=white:fontsize=40:x='rand(0,W-text_w)':y='rand(0,H-text_h)'" output.mp4`






