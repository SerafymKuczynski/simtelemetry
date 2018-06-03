# Project Structure

The source folder is divided into three parts:

### api
This folder contains modules / files that need to be shared between the main and the renderer process.
Normally they are used by a sim client in the main process for recording and a data provider in the renderer process for providing a structured way to access the raw data.

### main
Main-Process specific stuff. Mainly SimClients.

### renderer
Renderer-Process specific stuff. Contains the UI as well as DataProviders.