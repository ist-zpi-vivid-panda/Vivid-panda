FROM python:3.10-slim
WORKDIR /app
COPY . /app

RUN pip install --no-cache-dir -r requirements.txt

# Download weights for image colorization
RUN mkdir -p models && \
    curl -L -o models/ColorizeStable_gen.pth https://www.dropbox.com/scl/fi/lqpj4methnbmgjd9wlqto/ColorizeStable_gen.pth?rlkey=sj7d54400lq8898wf3s2higco&e=2

# Download weights for style transfer
RUN curl -L -o models/decoder.pth https://github.com/naoto0804/pytorch-AdaIN/releases/download/v0.0.0/decoder.pth && \
    curl -L -o models/vgg_normalised.pth https://github.com/naoto0804/pytorch-AdaIN/releases/download/v0.0.0/vgg_normalised.pth

# Download weights for image super-resolution
RUN curl -L -o models/EDSR_x4.pb https://github.com/Saafke/EDSR_Tensorflow/raw/master/models/EDSR_x4.pb

EXPOSE 5003
CMD ["python", "app.py"]