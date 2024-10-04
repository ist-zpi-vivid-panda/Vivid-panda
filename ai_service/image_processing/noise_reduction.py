@staticmethod
def calculate_noise(image):
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    noise = np.std(cv2.Laplacian(gray_image, cv2.CV_64F))
    return noise


def assess_image_noise(self, image, threshold=30):
    noise = self.calculate_noise(image)

    if noise > threshold:
        return "Obraz zawiera dużo szumu"
    else:
        return "Obraz ma niski poziom szumu"


# potem bilateral filtering