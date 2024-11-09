import Link from 'next/link';

import initTranslations from '../i18n';
import { LocaleParamProps, TranslationNamespace } from '../lib/internationalization/definitions';
import { cardClassName } from '../ui/shared/Card';

const Home = async ({ params }: LocaleParamProps) => {
  const { locale } = await params;

  const { t } = await initTranslations(locale, [TranslationNamespace.Common]);

  return (
    <div className="bg-left min-h-screen logoBackground flex justify-end">
      <h1 className="text-3xl font-bold text-white mt-10 text-center">Welcome to our Vivid-Panda app.</h1>
      <h1 className="text-3xl font-bold text-white mt-10 text-center">Here you can play with your photo!</h1>
      <div
        className="flex flex-col justify-center items-center w-full md:w-1/3 lg:w-1/4 px-5 py-8 mr-40"
        style={{ marginBottom: '20vh' }}
      >
        <div className="flex justify-center items-center w-full mt-10">
          <form className={`${cardClassName} p-5 gap-5 shadow-2xl flex flex-col items-center w-full`}>
            <span className="text-6xl p-5 text-center">Vivid Panda</span>

            <Link href="/auth/login">
              <button className="mt-5 text-white text-lg font-bold w-full h-64 rounded-lg hover:opacity-80 transition duration-200 btn-success px-10 py-4">
                {t('welcome_header')}
              </button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;
