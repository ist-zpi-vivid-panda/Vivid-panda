# README

## Table of Contents
- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)

## Description

## Installation

### Locally

If you want to run the project locally, install the requirements with the following command:

    pip install -r requirements.txt

Then download weights from here:

- image colorization: https://www.dropbox.com/scl/fi/lqpj4methnbmgjd9wlqto/ColorizeStable_gen.pth?rlkey=sj7d54400lq8898wf3s2higco&e=2
- style transfer: decoder.pth and vgg_normalised.pth from https://github.com/naoto0804/pytorch-AdaIN/releases/tag/v0.0.0
- image super-resolution: https://github.com/Saafke/EDSR_Tensorflow/blob/master/models/EDSR_x4.pb

And put them in the _models_ folder.

### Docker

Alternatively, you can build the docker image with the following command:

    docker build -t <image_name> .

All the weights will be downloaded automatically during the build process.

## Usage

### Locally

To run the application locally, run the following command:

    python app.py

The modul will be exposing on port 5001.

### Docker

If you want to run the application in a docker container, run the following command:

    ```docker run -p 5003:5003 <image_name>```

## License

Muszę wspomnieć o tym że modeli należą do innych osób, a nasze części kodu są dostępne na licencji MIT.
