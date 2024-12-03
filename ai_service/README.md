# README

## Table of Contents
- [Description](#description)
- [Results](#results)
- [Features](#a-deeper-look-at-features)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)

## Description

This project is a Python-based microservice that leverages deep learning models for various image processing tasks,
including image colorization, inpainting, style transfer, and image super-resolution. The application can be 
run locally or within a Docker container, making it easy to deploy and use in different environments.  

## Results

### A **video showcase** of the AI features can be found [here](https://ist-zpi-vivid-panda.github.io/ai_results/).

Remember to scroll down - there are four videos!

## A deeper look at features

**1. Image Colorization:** Automatically colorizes black and white images using a pre-trained model.

Models that can be found in the repository:
 - DeOldify (set as a default) - an ideal solution which met all the criteria for the production.

**2. Object Removal:** Removes objects from images using a pre-trained model.

Models that can be found in the repository:
 - LaMa (set as a default) - can be used for larger masks and inpainting the repeating patterns
 - Telea - classic solution which can be used for smaller areas
 - DeepFillv2 - was tested in notebooks and was not prepared for the production.

**3. Object Addition** Adds prompt-based object to the image using a pre-trained model. 

Models that can be found in the repository:
 - Stable Diffusion 1.5 (set as a default) - relatively small model with acceptable results
 - Stable Diffusion 3 - was prepared and tested in larger environment, is a good solution for the production if GPU is available 
 - Kandinsky 2.1 - stylized model which can be used for artistic purposes, relatively good results for a model of that size
 - Two implementations of Flux were tested (one from the hugging face implementation and one from diffusers library, but neither of them was successful)

**4. Image Super-Resolution:** Enhances the resolution of images.

Models that can be found in the repository:
 - EDSR (set as a default)
 - ESRGAN (cam possibly be used in larger environments)
 - A huge amount of tested solutions in notebooks, but not prepared for the production.

**5. Style Transfer:** Applies artistic styles to images.

Models that can be found in the repository:
 - AdaIN (set as a default) - a solution that works real time and has a good quality of the output
 - CycleGAN - was tested in notebooks and was not prepared for the production due to the low style transfer quality
 - STROTSS - was tested in notebooks and was not prepared for the production due to the larger size of the model
 - Neural Style Transfer - was tested in notebooks and was not prepared for the production due to the slow speed of the model and the issues with the convergence

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

The modul will be exposing on port 5000.

### Docker

If you want to run the application in a docker container, run the following command:

    ```docker run -p 5000:5000 <image_name>```