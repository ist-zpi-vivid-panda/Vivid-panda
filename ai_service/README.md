# README

## Table of Contents
- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)

## Description

## Installation

### Locally

If you want to run locally, install the requirements with the following command:

    ```pip install -r requirements.txt```

and download weights from here: https://drive.google.com/drive/folders/1J3Z1ZQ1Q2gJQ6Z0Z1Z8Zzr3JY1ZzZ1Z1?usp=sharing
and put them in the _models_ folder.

### Docker

Alternatively, you can build the docker image with the following command:

    ```docker build -t <image_name> .```

All the weights will be downloaded automatically during the build process.

## Usage

### Locally

To run the application locally, run the following command:

    ```python app.py```

The modul will be exposing on port 5001.

### Docker

If you want to run the application in a docker container, run the following command:

    ```docker run -p 5001:5001 <image_name>```

## Issues

If you are using basicsr, replace functional_tensor to functional.

## License

All the models used in this project are under the MIT or Apache2.0 license.
