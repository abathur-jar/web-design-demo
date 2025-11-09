@echo off
echo Создаю превью для видео с конкретными моментами...
mkdir videos\previews 2>nul

rem Lipgloss - возьмем кадр на 3 секунде (когда анимация яркая)
ffmpeg -i videos/Lipgloss.mp4 -ss 00:00:03 -vframes 1 -q:v 2 videos/previews/Lipgloss-preview.jpg

rem Comp - на 2 секунде  
ffmpeg -i videos/Comp.mp4 -ss 00:00:02 -vframes 1 -q:v 2 videos/previews/Comp-preview.jpg

rem Abathur - на 5 секунде (когда появляется основной объект)
ffmpeg -i videos/abathur.mp4 -ss 00:00:05 -vframes 1 -q:v 2 videos/previews/abathur-preview.jpg

rem Ring - на 4 секунде
ffmpeg -i videos/Ring.mp4 -ss 00:00:04 -vframes 1 -q:v 2 videos/previews/Ring-preview.jpg

rem Slurry - на 2.5 секунде
ffmpeg -i videos/Slurry.mp4 -ss 00:00:02.5 -vframes 1 -q:v 2 videos/previews/Slurry-preview.jpg

rem ZheeShe - на 6 секунде
ffmpeg -i videos/ZheeShe.mp4 -ss 00:00:06 -vframes 1 -q:v 2 videos/previews/ZheeShe-preview.jpg

rem Solar System - на 8 секунде (когда планеты видны)
ffmpeg -i videos/solar.mp4 -ss 00:00:08 -vframes 1 -q:v 2 videos/previews/solar-preview.jpg

echo Все превью созданы с конкретными моментами!
pause