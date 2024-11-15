# Vivid-Panda
Vivid-Panda to nasze zespołowe przedsięwzięcie inżynierskie. Próbujemy w nim przedstawić nasze umiejętności nabyte podczas studiów. 

# Aplikacja internetowa do edycji zdjęć.
Projekt jest doskonałym rozwiązaniem zarówno dla osób, które interesują się obróbką graficzną jak i dla tych, którzy chcą w prosty, intuicyjny sposób udoskonalić utrwalone na zdjęciach chwile. 

Dzięki technologii opartej na sztucznej inteligencji, możesz z łatwością automatyzować skomplikowane zadania graficzne. Oferujemy między innymi: możliwość koloryzacji starych, czarno-białych zdjęć, przywracając im życie. Dodatkowo, możliwość usuwania niechcianych elementy z obrazów, daje pełną kontrolę nad obrazem.

To idealne narzędzie zarówno dla amatorów, jak i profesjonalistów – prostota obsługi połączona z zaawansowanymi funkcjami, które otwierają nieograniczone możliwości!

# Cele
Celem naszej aplikacji jest umożliwienie edycji zdjęć każdemu, kto tego potrzebuje - niezależnie od poziomu zaawansowania. Nasza aplikacja oferować będzie możliwość podstawowych operacji edycji, które użytkownik będzie mógł szybko wykonać. Wykorzystanie sztucznej inteligencji pozwala jednak na bardziej zaawansowane funkcje, które pozwolą użytkownikowi na eksperymentowanie ze zdjęciem. 

Na rynku aktualnie są narzędzia, które oferują podobne rozwiązania, są one jednak stosunkowo drogie, ponadto próg wejścia w nie może być zniechęcający dla wielu użytkowników, którzy chcą wiele operacji wykonać szybko bez konieczności wielogodzinnej nauki narzędzia. Nasza aplikacja oferuje intuicyjny interfejs, który jasno prezentuje swoje funkcje, dzięki czemu osoba z niego korzystająca, nie czuje się przytłoczona nadmiarem informacji. 

Głównym celem biznesowym naszego systemu będzie dostarczenie użytkownikom jak najbardziej funkcjonalnego systemu, który pozwoli im na edycję ich grafiki. Chcemy umożliwić amatorom i profesjonalistom na udoskonalenie ich uchwyconych momentów. Aplikacja nie będzie wymagała od nich intensywnego wdrożenia w jej obsługę, tylko pozwolić na bezstresową zabawę ich zdjęciami. Chcemy również w przyszłości konkurować z wielkimi, profesjonalnymi narzędziami, które dla wielu z nas są poza zasięgiem. 

W przyszłości planujemy wprowadzić również model Freemium naszej aplikacji (za niewielką opłatą odblokowane będą dodatkowe funkcje).

## Funkcje

- Rejestracja, logowanie, odzyskiwanie hasła
- Przesyłanie (również z funkcją drag and drop), zapisywanie i pobieranie zdjęcia
- Obróbka zdjęcia
- Wspomaganie i zaawansowane funkcje edycji zdjęcia - moduł AI, który jest w stanie kolorować czarno-białe zdjęcia, upscaling czy inpainting.

# Technologie
## Frontend: 
- [Next.js](https://nextjs.org/docs)
- [Typescript](https://www.typescriptlang.org/docs/)
- [Material.UI](https://mui.com/material-ui/)
- [Tanstack Query](https://tanstack.com/query/latest/docs/framework/react/overview)
- [Zustand](https://www.npmjs.com/package/zustand)
- Walidacja: [Ajv.js](https://www.npmjs.com/package/ajv)
- [React Hook Forms](https://react-hook-form.com/docs)
- [Cropperjs](https://github.com/fengyuanchen/cropperjs/blob/main/README.md)
  
## Backend:
- [Flask](https://flask.palletsprojects.com/en/3.0.x/)  
- [Python](https://docs.python.org/pl/3.8/reference/index.html#reference-index) 
- [OpenAPI](https://swagger.io/specification/)
- [Marshmallow](https://marshmallow.readthedocs.io/en/stable/)
- Baza danych: [Mongo](https://www.mongodb.com/docs/?msockid=201a404f4cd36fe517b852344de46e3e)
 
## AI
- [Python](https://docs.python.org/pl/3.8/reference/index.html#reference-index) 
- [PyTorch](https://pytorch.org/docs/stable/index.html)
## Obróbka grafiki
- [OpenCV](https://docs.opencv.org/4.x/index.html)
- [PIL](https://pillow.readthedocs.io/en/stable/)
- [numpy](https://numpy.org/doc/)
- [sci-kit](https://scikit-learn.org/stable/index.html)
- Koloryzacja zdjęcia - GAN, NoGAN (architektura uNet)
- Upscaling - Głęboki model generatywny
- Inpainting - [LaMa](https://github.com/advimman/lama)/[Stable Diffusion 1.5](https://github.com/Stability-AI/stablediffusion)

## Upublicznienie
- [Docker](https://docs.docker.com/)

# Zakres obowiązków każdego z uczestników

Scrum Master: Paweł Dudek

Moduł AI: Katsiaryna Viarenich

Frontend: Uladzimir Mazaleuski, Paweł Dudek, Karolina Majkowska 

Backend: Paweł Dudek, Karolina Majkowska


Osoby wspierające nasz zespół: dr.inż Martin Tabakow, dr inż. Piotr Syga

## Backend
Moduł związany z obsługą użytkownika: Paweł Dudek, Karolina Majkowska

Moduł związany z obsługą plików: Paweł Dudek, Karolina Majkowska

Baza danych: Paweł Dudek

## Frontend
Moduł związny z logowaniem/rejestracją: Paweł Dudek

Moduł związany z odzyskiwaniem hasła: Karolina Majkowska

Moduł związany z listą zdjęć: Paweł Dudek

Moduł związany z przesyłaniem zdjęć: Karolina Majkowska, Paweł Dudek

Moduł związany z widokiem głównym strony: Karolina Majkowska

Konfiguracja frontendu w celu poprawienia jego działania: Uladzimir Mazaleuski

Moduł edycji zdjęć: Uladzimir Mazaleuski, Paweł Dudek, Karolina Majkowska

## Testowanie
Uladzimir Mazaleuski

## Moduł AI
Katsiaryna Viarenich 

## DevOps
Katsiaryna Viarenich
