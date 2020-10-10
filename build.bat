@echo off
cls

rmdir /Q /S .\\dist
mkdir .\\dist
xcopy .\\ext .\\dist /s /e /Y

webpack
