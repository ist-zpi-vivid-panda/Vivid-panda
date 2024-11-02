import Link from 'next/link';

import initTranslations from '../i18n';
import { LocaleParamProps, TranslationNamespace } from '../lib/internationalization/definitions';
import { cardClassName } from '../ui/shared/Card';

const Home = async ({ params }: LocaleParamProps) => {
  const { locale } = await params;

  const { t } = await initTranslations(locale, [TranslationNamespace.Common]);

  return (
    <div className="bg-left min-h-screen logoBackground">
      <div className="flex justify-center items-center">
        <h1 className="text-3xl font-bold items-center text-white mt-10">Welcome to our Vivid-Panda app.</h1>
      </div>
      <div className="flex justify-center items-center">
        <h1 className="text-3xl font-bold items-center text-white mt-10">Here you can play with your photo!</h1>
      </div>
      <div className="flex px-20 py-10 pb-40 absolute inset-y-0 right-0 items-center flex-col">
        <form className={`${cardClassName} p-10 gap-5 shadow-2xl flex flex-col items-center`}>
          <span className="text-6xl p-10">Vivid Panda</span>

          <Link href="/auth/login">
            <button className="mt-5 text-white text-lg font-bold w-64 h-64 rounded-lg hover:opacity-80 transition duration-200 btn-success px-10 py-4">
              {t('welcome_header')}
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Home;
